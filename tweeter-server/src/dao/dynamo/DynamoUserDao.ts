import {
  BatchGetCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserEntity } from "../../entity/UserEntity";
import { UserDao } from "../UserDao";

export class DynamoUserDAO implements UserDao {
  readonly tableName = "user";
  readonly first_name = "first_name";
  readonly last_name = "last_name";
  readonly alias = "alias";
  readonly password = "password";
  readonly image_url = "image_url";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  /**
   * Increment the number of times visitor has visited location
   *
   * @param alias
   */
  async addUser(user: UserEntity): Promise<void> {
    await this.putUser(user);
  }

  private async putUser(user: UserEntity): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.first_name]: user.first_name,
        [this.last_name]: user.last_name,
        [this.alias]: user.alias,
        [this.password]: user.password,
        [this.image_url]: user.image_url,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  public async getUser(alias: string): Promise<UserEntity | undefined> {
    const params = {
      TableName: this.tableName,
      Key: { [this.alias]: alias },
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : new UserEntity(
          output.Item[this.first_name],
          output.Item[this.last_name],
          output.Item[this.alias],
          output.Item[this.password],
          output.Item[this.image_url]
        );
  }

  /**
   * Delete all visits of visitor to location
   *
   * @param auth
   */
  async deleteUser(user: UserEntity): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateUserItem(user),
    };
    await this.client.send(new DeleteCommand(params));
  }

  private generateUserItem(user: UserEntity) {
    return {
      [this.alias]: user.alias,
    };
  }
  public async batchGetUsers(aliases: string[]): Promise<UserEntity[]> {
    if (aliases && aliases.length > 0) {
      // Deduplicate the names (only necessary if used in cases where there can be duplicates)
      const namesWithoutDuplicates = [...new Set(aliases)];
      console.log("alias", aliases[0]);
      const keys = namesWithoutDuplicates.map<Record<string, {}>>((alias) => ({
        [this.alias]: alias,
      }));

      const params = {
        RequestItems: {
          [this.tableName]: {
            Keys: keys,
          },
        },
      };

      const result = await this.client.send(new BatchGetCommand(params));
      if (result.Responses) {
        return result.Responses[this.tableName].map<UserEntity>(
          (item) =>
            new UserEntity(
              item[this.first_name],
              item[this.last_name],
              item[this.alias],
              "",
              item[this.image_url]
            )
        );
      }
    }
    return [];
  }
}
