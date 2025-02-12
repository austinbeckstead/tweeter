import { useState } from "react";
import {
  NavigateUserPresenter,
  NavigateUserView,
} from "../../presenters/NavigateUserPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";

const useUserNavigation = (
  presenterGenerator: (view: NavigateUserView) => NavigateUserPresenter
) => {
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const listener: NavigateUserView = {
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage,
  };
  const [presenter] = useState(presenterGenerator(listener));

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    const alias = extractAlias(event.target.toString());
    presenter.navigateToUser(alias, currentUser, authToken);
  };
  return navigateToUser;
};
export default useUserNavigation;
