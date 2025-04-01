import { User, AuthToken, FakeData, UserDto } from "tweeter-shared";
import { AuthDao } from "../../dao/AuthDao";
import { DynamoFactory } from "../../dao/dynamo/DynamoFactory";
import { FollowsDao } from "../../dao/FollowsDao";
import { Auth } from "../../entity/Auth";
import { Follows } from "../../entity/Follows";

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
  public constructor() {
    this.followsDao = this.factory.getFollowsDAO();
    this.authDao = this.factory.getAuthDAO();
  }
  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthToken]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("Invalid alias or password");
    }
    return [user.dto, FakeData.instance.authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("Invalid registration");
    }
    return [user.dto, FakeData.instance.authToken];
  }
  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    const user: User | null = FakeData.instance.findUserByAlias(alias);
    return user ? user.dto : null;
  }

  public async getIsFollower(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    let follows: Follows | undefined = new Follows(
      selectedUserAlias,
      userAlias
    );
    follows = await this.followsDao.getFollows(follows);
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
    const auth = new Auth(token, "");
    const userAlias = await this.authDao.getAliasFromAuth(auth);
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
    const auth = new Auth(token, "");
    const userAlias = await this.authDao.getAliasFromAuth(auth);
    const follows = new Follows(userAlias!, selectedAlias);
    await this.followsDao.deleteFollows(follows);

    // TODO: Call the server
    const followeeCount = await this.getFolloweeCount(token, selectedAlias);
    const followerCount = await this.getFollowerCount(token, selectedAlias);

    return [followerCount, followeeCount];
  }
  public async logout(token: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 1000));
  }
}
