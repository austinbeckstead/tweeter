import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthDao } from "../AuthDao";
import { Auth } from "../../entity/Auth";

export class DynamoAuthDAO implements AuthDao {
  readonly tableName = "auth";
  readonly auth_token = "auth_token";
  readonly alias = "alias";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  /**
   * Increment the number of times visitor has visited location
   *
   * @param auth
   */
  async addAuth(auth: Auth): Promise<void> {
    await this.putAuth(auth);
  }

  private async putAuth(auth: Auth): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.auth_token]: auth.auth_token,
        [this.alias]: auth.alias,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  public async getAuth(token: string): Promise<Auth | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.auth_token]: token,
      },
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : new Auth(output.Item[this.auth_token], output.Item[this.alias]);
  }

  /**
   * Delete all visits of visitor to location
   *
   * @param auth
   */
  async deleteAuth(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.auth_token]: token,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }
  async getAliasFromAuth(token: string): Promise<string | undefined> {
    const auth_token = await this.getAuth(token);
    return auth_token ? auth_token.alias : undefined;
  }
}
