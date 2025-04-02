import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Follows } from "../../entity/Follows";
import { DataPage } from "../../entity/DataPage";
import { FollowsDao } from "../FollowsDao";

export class DynamoFollowsDAO implements FollowsDao {
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly follower_handle = "follower_handle";
  readonly followee_handle = "followee_handle";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  /**
   * Increment the number of times visitor has visited location
   *
   * @param follows
   */
  async addFollows(follows: Follows): Promise<void> {
    await this.putFollower(follows);
  }
  //TESTING
  public async getClientConfig() {
    const region = await this.client.config.region();
    return region;
  }

  private async putFollower(follows: Follows): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.follower_handle]: follows.follower_handle,
        [this.followee_handle]: follows.followee_handle,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  public async getFollows(follows: Follows): Promise<Follows | undefined> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowsItem(follows),
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : new Follows(
          output.Item[this.follower_handle],
          output.Item[this.followee_handle]
        );
  }

  /**
   * Delete all visits of visitor to location
   *
   * @param follows
   */
  async deleteFollows(follows: Follows): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowsItem(follows),
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getNumFollowees(
    token: string,
    follower_handle: string
  ): Promise<number> {
    const params: QueryCommandInput = {
      KeyConditionExpression: this.follower_handle + " = :v",
      ExpressionAttributeValues: {
        ":v": follower_handle,
      },
      TableName: this.tableName,
      Select: "COUNT",
    };

    const data = await this.client.send(new QueryCommand(params));
    return data.Count!; // The number of matching items
  }
  async getNumFollowers(
    token: string,
    followee_handle: string
  ): Promise<number> {
    const params: QueryCommandInput = {
      KeyConditionExpression: this.followee_handle + " = :v",
      ExpressionAttributeValues: {
        ":v": followee_handle,
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Select: "COUNT",
    };
    const data = await this.client.send(new QueryCommand(params));
    return data.Count!; // The number of matching items
  }

  /**
   * Fetch the next page of followers given a followee
   *
   * @param followee_handle
   * @param lastFollower_handle The last follower returned in the previous page of results
   * @param limit The maximum number of visitors to include in the result
   * @return The next page of visitors who have visited location
   */

  async getPageOfFollowees(
    follower_handle: string,
    lastItem: string | undefined = undefined,
    limit: number = 10
  ): Promise<DataPage<Follows>> {
    const params = {
      KeyConditionExpression: this.follower_handle + " = :v",
      ExpressionAttributeValues: {
        ":v": follower_handle,
      },
      TableName: this.tableName,
      Limit: limit,
      ExclusiveStartKey:
        lastItem === undefined
          ? undefined
          : {
              [this.follower_handle]: follower_handle,
              [this.followee_handle]: lastItem,
            },
    };

    const items: Follows[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new Follows(item[this.follower_handle], item[this.followee_handle])
      )
    );
    return new DataPage<Follows>(items, hasMorePages);
  }
  async getPageOfFollowers(
    followee_handle: string,
    lastItem: string | undefined = undefined,
    limit: number = 10
  ): Promise<DataPage<Follows>> {
    const params = {
      KeyConditionExpression: this.followee_handle + " = :loc",
      ExpressionAttributeValues: {
        ":loc": followee_handle,
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: limit,
      ExclusiveStartKey:
        lastItem === undefined
          ? undefined
          : {
              [this.follower_handle]: lastItem,
              [this.followee_handle]: followee_handle,
            },
    };

    const items: Follows[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new Follows(item[this.follower_handle], item[this.followee_handle])
      )
    );
    return new DataPage<Follows>(items, hasMorePages);
  }
  private generateFollowsItem(follows: Follows) {
    return {
      [this.follower_handle]: follows.follower_handle,
      [this.followee_handle]: follows.followee_handle,
    };
  }
}
