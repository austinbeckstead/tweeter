import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import {
  mock,
  instance,
  verify,
  spy,
  when,
  anything,
  capture,
} from "ts-mockito";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";
describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;
  const status: string = "This is my status";
  const currentUser: User = new User("first", "last", "alias", "imageUrl");
  const authToken = new AuthToken("abc123", Date.now());
  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    mockPostStatusViewInstance.authToken = authToken;
    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);
    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);
    when(postStatusPresenterSpy.statusService).thenReturn(
      mockStatusServiceInstance
    );
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(status, currentUser);
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });
  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(status, currentUser);
    verify(mockStatusService.postStatus(anything(), anything())).once();
    let [capturedAuthToken, capturedStatus] = capture(
      mockStatusService.postStatus
    ).last();
    expect(capturedAuthToken).toEqual(authToken);
    expect(capturedStatus.post).toEqual(status);
  });
  it("tells the view to clear the last info message, clear the post, and display a status posted message when posting of status is successful", async () => {
    await postStatusPresenter.submitPost(status, currentUser);
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.clearPost()).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();
  });
  it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message when posting of the status is not successful", async () => {
    const error = new Error("An error occurred");
    when(mockStatusService.postStatus).thenThrow(error);
    await postStatusPresenter.submitPost(status, currentUser);
    verify(mockPostStatusView.clearLastInfoMessage()).never();
    verify(mockPostStatusView.clearPost()).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).never();
    verify(
      mockPostStatusView.displayErrorMessage(
        `Failed to post the status because of exception: An error occurred`
      )
    );
  });
});
