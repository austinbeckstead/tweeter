import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Story } from "../../entity/Story";
import { StoryDao } from "../StoryDao";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage } from "../../entity/DataPage";

export class DynamoStoryDAO implements StoryDao {
  readonly tableName = "story";
  readonly sender_alias = "sender_alias";
  readonly timestamp = "timestamp";
  readonly post = "post";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  async addStory(story: Story): Promise<void> {
    await this.putStory(story);
  }
  private async putStory(story: Story): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.sender_alias]: story.sender_alias,
        [this.timestamp]: story.timestamp,
        [this.post]: story.post,
      },
    };
    await this.client.send(new PutCommand(params));
  }
  async getPageOfStories(
    sender_alias: string,
    lastItem: number | undefined = undefined,
    limit: number = 10
  ): Promise<DataPage<Story>> {
    const params = {
      KeyConditionExpression: this.sender_alias + " = :v",
      ExpressionAttributeValues: {
        ":v": sender_alias,
      },
      TableName: this.tableName,
      Limit: limit,
      ExclusiveStartKey:
        lastItem === undefined
          ? undefined
          : {
              [this.sender_alias]: sender_alias,
              [this.timestamp]: lastItem,
            },
    };

    const items: Story[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new Story(
          item[this.sender_alias],
          item[this.timestamp],
          item[this.post]
        )
      )
    );
    return new DataPage<Story>(items, hasMorePages);
  }
}
