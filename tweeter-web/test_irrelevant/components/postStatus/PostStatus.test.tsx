import {
  PostStatusPresenter,
  PostStatusView,
} from "../../../src/presenter/PostStatusPresenter";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { mock, instance, verify, spy, when } from "ts-mockito";

describe("Post Status Component", () => {
  it("disables the Post Status and Clear buttons when first rendered", async () => {
    const { postStatusButton, clearStatusButton } =
      renderPostStatusAndGetElement();
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });
  it("enables the Post Status and Clear buttons when the field has text", async () => {
    const { postStatusButton, clearStatusButton, postStatusField, user } =
      renderPostStatusAndGetElement();
    await user.type(postStatusField, "a");
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
  });
  it("disables both buttons when the text field is cleared", async () => {
    const { postStatusButton, clearStatusButton, postStatusField, user } =
      renderPostStatusAndGetElement();
    await user.type(postStatusField, "a");
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
    await user.clear(postStatusField);
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });
  it("calls the presenter's postStatus method with correct parameters when the Post Status button is pressed", async () => {
    const mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    const postStatusPresenter = instance(postStatusPresenterSpy);
    const { postStatusButton, postStatusField, user } =
      renderPostStatusAndGetElement(postStatusPresenter);
    await user.type(postStatusField, "a");
    await user.click(postStatusButton);
    verify(postStatusPresenterSpy.submitPost("a", null)).once();
  });
});
const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
};
const renderPostStatusAndGetElement = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();
  renderPostStatus(presenter);
  const postStatusButton = screen.getByRole("button", {
    name: /Post Status/i,
  });
  const clearStatusButton = screen.getByRole("button", { name: /Clear/i });
  const postStatusField = screen.getByPlaceholderText("What's on your mind?");

  return {
    postStatusButton,
    clearStatusButton,
    postStatusField,
    user,
  };
};
