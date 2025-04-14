import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginUserPresenter } from "../../../../src/presenter/LoginUserPresenter";
import "@testing-library/jest-dom";
import { mock, instance, verify, spy, when } from "ts-mockito";
import { UserView } from "../../../../src/presenter/UserPresenter";
library.add(fab);

describe("Login Component", () => {
  it("starts with the sign in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement();
    expect(signInButton).toBeDisabled();
  });
  it("enables the sign in button when both the alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement();
    await user.type(aliasField, "a");
    await user.type(passwordField, "b");
    expect(signInButton).toBeEnabled();
  });
  it("disables the sign in button if either the alias or password fields are cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement();

    await user.type(aliasField, "a");
    await user.type(passwordField, "b");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "a");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's login method with correct parameters when the sign in button is pressed", async () => {
    const mockUserView = mock<UserView>();
    const mockUserViewInstance = instance(mockUserView);
    const loginUserPresenterSpy = spy(
      new LoginUserPresenter(mockUserViewInstance)
    );
    const loginUserPresenter = instance(loginUserPresenterSpy);
    when(loginUserPresenterSpy.setRememberMe).thenReturn();
    when(loginUserPresenterSpy.isLoading).thenReturn(false);
    const alias = "alias";
    const password = "password";
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement(loginUserPresenter);
    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);
    verify(loginUserPresenterSpy.loginUser(alias, password)).once();
  });
});
const renderLogin = (presenter?: LoginUserPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <Login presenter={presenter} /> : <Login />}
    </MemoryRouter>
  );
};

const renderLoginAndGetElement = (presenter?: LoginUserPresenter) => {
  const user = userEvent.setup();
  renderLogin(presenter);
  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");
  return {
    signInButton,
    aliasField,
    passwordField,
    user,
  };
};
