import { AuthToken, LoginUserRequest, Status, User } from "tweeter-shared";
import { ServerFacade } from "../src/network/ServerFacade";
import "isomorphic-fetch";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../src/presenter/PostStatusPresenter";
import { StatusService } from "../src/model/service/StatusService";
import { instance, mock, spy, verify, when } from "ts-mockito";

describe("Final Integration Test", () => {
  let serverFacade: ServerFacade;
  let statusService: StatusService;
  let user: User;
  let token: AuthToken;
  let status: string;

  const request: LoginUserRequest = {
    alias: "@automatedtestalias",
    password: "password",
  };

  beforeAll(async () => {
    serverFacade = new ServerFacade();
    statusService = new StatusService();
    [user, token] = await serverFacade.loginUser(request);
    status = "Test Status" + Date.now();
  });

  it("Appends a posted status to a user's story", async () => {
    const mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    mockPostStatusViewInstance.authToken = token;

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    const postStatusPresenter = instance(postStatusPresenterSpy);

    when(postStatusPresenterSpy.statusService).thenReturn(statusService);

    await postStatusPresenter.submitPost(status, user);

    await new Promise((res) => setTimeout(res, 2000)); // wait for backend

    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();
  });

  it("Retrieves the story correctly", async () => {
    let lastItem: Status | null = null;
    let allStatuses: Status[] = [];
    let currPage: Status[] = [];
    let hasMore = true;

    while (hasMore) {
      [currPage, hasMore] = await statusService.loadMoreStoryItems(
        token,
        user,
        10,
        lastItem
      );
      allStatuses.push(...currPage);
      lastItem = currPage.length > 0 ? currPage[currPage.length - 1] : null;
    }

    const found = allStatuses.some((s) => s.post === status);
    expect(found).toBe(true);
  });
});
