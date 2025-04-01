import { User, AuthToken, FakeData, UserDto } from "tweeter-shared";
import { AuthDao } from "../../dao/AuthDao";
import { DynamoFactory } from "../../dao/dynamo/DynamoFactory";
import { FollowsDao } from "../../dao/FollowsDao";
import { UserDao } from "../../dao/UserDao";
import { Auth } from "../../entity/Auth";
import { Follows } from "../../entity/Follows";
import { UserEntity } from "../../entity/UserEntity";
import { randomBytes } from "crypto";

//For User table:
// Partition Key: Alias      Sort Key: None

//For AuthToken table:
// Partition Key: AuthToken  Sort Key: None

//For Feed table:
// Partition Key: Receiver Alias  Sort Key: Timestamp (isodate) and Sender Alias concatenated

//For Story table:
// Partition Key: Sender Alias      Sort Key: Timestamp (display order)

//For Follows table:
// Partition Key: Follower Alias     Sort Key: followee alias

//For batch get of user data for feed, use VisitorDAO from dynamodb samples (databases exercise) use
// aliases instead of visitorNames

//Pass factories in when doing service constructor in Lambdas

export class UserService {
  factory = new DynamoFactory();
  followsDao: FollowsDao;
  authDao: AuthDao;
  userDao: UserDao;
  public constructor() {
    this.followsDao = this.factory.getFollowsDAO();
    this.authDao = this.factory.getAuthDAO();
    this.userDao = this.factory.getUserDAO();
  }
  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthToken]> {
    // TODO: Replace with the result of calling the server
    const userEntity = await this.userDao.getUser(alias);
    //validate alias
    if (userEntity === undefined) {
      throw new Error("Invalid alias or password");
    }
    //validate password

    const correctPassword = userEntity!.password;
    if (password != correctPassword) {
      throw new Error("Invalid alias or password");
    }
    const user = new User(
      userEntity.first_name,
      userEntity.last_name,
      userEntity.alias,
      ""
    );
    //generate auth
    const authToken = await this.generateAuth(alias);
    return [user.dto, authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthToken]> {
    const takenUser = await this.userDao.getUser(alias);
    //Make sure alias isn't taken
    if (takenUser != undefined) {
      throw new Error("Alias Taken");
    }
    const userEntity = new UserEntity(firstName, lastName, alias, password);
    //add User to database
    await this.userDao.addUser(userEntity);
    const user = new User(firstName, lastName, alias, "");
    //generate Auth
    const authToken = await this.generateAuth(alias);
    return [user.dto, authToken];
  }
  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    const authToken = await this.authDao.getAuth(token);
    if (authToken == undefined) {
      throw new Error("Not Authenticated");
    }
    const userEntity = await this.userDao.getUser(alias);
    const user = userEntity
      ? new User(
          userEntity.first_name,
          userEntity.last_name,
          userEntity.alias,
          ""
        )
      : null;
    return user ? user.dto : null;
  }
  private async generateAuth(alias: string): Promise<AuthToken> {
    const token = AuthToken.Generate();
    await this.authDao.addAuth(new Auth(token.token, alias));
    return token;
  }
  public async getIsFollower(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    let followsQuery: Follows | undefined = new Follows(
      //userAlias,
      "EDITED ALIAS",
      selectedUserAlias
    );
    const follows = await this.followsDao.getFollows(followsQuery);
    return follows != undefined;
  }
  public async getFolloweeCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return this.followsDao.getNumFollowees(token, userAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return this.followsDao.getNumFollowers(token, userAlias);
  }

  public async follow(
    token: string,
    selectedAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    //need to implement getting user alias from authToken
    const userAlias = await this.authDao.getAliasFromAuth(token);
    const follows = new Follows(userAlias!, selectedAlias);
    await this.followsDao.addFollows(follows);
    const followerCount = await this.getFollowerCount(token, userAlias!);
    const followeeCount = await this.getFolloweeCount(token, userAlias!);
    return [followerCount, followeeCount];
  }
  public async unfollow(
    token: string,
    selectedAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    const userAlias = await this.authDao.getAliasFromAuth(token);
    const follows = new Follows(userAlias!, selectedAlias);
    await this.followsDao.deleteFollows(follows);

    // TODO: Call the server
    const followeeCount = await this.getFolloweeCount(token, selectedAlias);
    const followerCount = await this.getFollowerCount(token, selectedAlias);

    return [followerCount, followeeCount];
  }
  public async logout(token: string): Promise<void> {
    await this.authDao.deleteAuth(token);
  }
}
