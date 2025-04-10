import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage } from "../../entity/DataPage";
import { Feed } from "../../entity/Feed";
import { FeedDao } from "../FeedDao";
import { StatusDto } from "tweeter-shared";
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoFeedDAO implements FeedDao {
  readonly tableName = "feed";
  readonly receiver_alias = "receiver_alias";
  readonly sort_val = "sort_val";
  readonly sender_alias = "sender_alias";
  readonly post = "post";
  readonly timestamp = "timestamp";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async addFeed(feed: Feed[]): Promise<void> {
    await this.putFeed(feed);
  }
  private async putFeed(feed: Feed[]): Promise<void> {
    const BATCH_SIZE = 25;

    for (let i = 0; i < feed.length; i += BATCH_SIZE) {
      const batch = feed.slice(i, i + BATCH_SIZE);

      const requestItems = batch.map((item) => {
        const senderAlias = item.sender_alias;
        const timestamp = item.timestamp;
        const isodate = new Date(timestamp).toISOString();
        const sortVal = isodate + senderAlias;

        return {
          PutRequest: {
            Item: {
              [this.receiver_alias]: item.receiver_alias,
              [this.sort_val]: sortVal,
              [this.sender_alias]: senderAlias,
              [this.post]: item.post,
              [this.timestamp]: timestamp,
            },
          },
        };
      });

      const params = {
        RequestItems: {
          [this.tableName]: requestItems,
        },
      };

      await this.client.send(new BatchWriteCommand(params));
    }

    /*
    const senderAlias = feed.sender_alias;
    const timestamp = feed.timestamp;
    const isodate = new Date(timestamp).toISOString();
    const sortVal = isodate + senderAlias;
    const params = {
      TableName: this.tableName,
      Item: {
        [this.receiver_alias]: feed.receiver_alias,
        [this.sort_val]: sortVal,
        [this.sender_alias]: feed.sender_alias,
        [this.post]: feed.post,
        [this.timestamp]: feed.timestamp,
      },
    };
    await this.client.send(new PutCommand(params));*/
  }
  async getPageOfFeed(
    receiver_alias: string,
    lastItem: StatusDto | null = null,
    limit: number = 10
  ): Promise<DataPage<Feed>> {
    const timestamp = lastItem ? lastItem.timestamp : null;
    const senderAlias = lastItem ? lastItem.user.alias : null;
    const isodate = timestamp ? new Date(timestamp).toISOString() : null;
    const sortVal = isodate && senderAlias ? isodate + senderAlias : undefined;
    const params = {
      KeyConditionExpression: this.receiver_alias + " = :v",
      ExpressionAttributeValues: {
        ":v": receiver_alias,
      },
      TableName: this.tableName,
      Limit: limit,
      ExclusiveStartKey:
        sortVal === undefined
          ? undefined
          : {
              [this.receiver_alias]: receiver_alias,
              [this.sort_val]: sortVal ?? undefined,
            },
    };

    const items: Feed[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new Feed(
          item[this.receiver_alias],
          item[this.sender_alias],
          item[this.timestamp],
          item[this.post]
        )
      )
    );
    return new DataPage<Feed>(items, hasMorePages);
  }
}
