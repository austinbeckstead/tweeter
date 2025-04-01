import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
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
          output.Item[this.password]
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
}
