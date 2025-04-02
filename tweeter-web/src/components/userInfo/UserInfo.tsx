import "./UserInfo.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";
import {
  UserInfoView,
  UserInfoPresenter,
} from "../../presenter/UserInfoPresenter";
interface Props {
  presenterGenerator: (view: UserInfoView) => UserInfoPresenter;
}
const UserInfo = (props: Props) => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

  const { currentUser, authToken, displayedUser, setDisplayedUser } =
    useUserInfo();

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }
  const listener: UserInfoView = {
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    clearLastInfoMessage: clearLastInfoMessage,
    authToken: authToken,
  };
  const [presenter] = useState(props.presenterGenerator(listener));

  const [isLoading, setIsLoading] = useState(presenter.isLoading);
  useEffect(() => {
    setIsLoading(presenter.isLoading);
  }, [presenter.isLoading]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      console.log(currentUser!.alias);
      console.log(displayedUser!.alias);
      await presenter.setIsFollowerStatus(currentUser!, displayedUser!);
      await presenter.setNumbFollowees(displayedUser!);
      await presenter.setNumbFollowers(displayedUser!);
      // Now that all async calls are complete, update the state
      setIsFollower(presenter.isFollower);
      setFolloweeCount(presenter.followeeCount);
      setFollowerCount(presenter.followerCount);
      setIsLoading(false);
    };
    fetchData();
  }, [displayedUser]);

  const [isFollower, setIsFollower] = useState(presenter.isFollower);
  const [followeeCount, setFolloweeCount] = useState(presenter.followeeCount);
  const [followerCount, setFollowerCount] = useState(presenter.followerCount);

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
    setFolloweeCount(presenter.followeeCount);
    setFollowerCount(presenter.followerCount);
  };

  const followDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();
    await presenter.followDisplayedUser(displayedUser);
    setIsFollower(presenter.isFollower);
    setFolloweeCount(presenter.followeeCount);
  };

  const unfollowDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();
    await presenter.unfollowDisplayedUser(displayedUser);
    setIsFollower(presenter.isFollower);
    setFollowerCount(presenter.followerCount);
  };

  return (
    <div className={isLoading ? "loading" : ""}>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={""}
                    onClick={(event) => switchToLoggedInUser(event)}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) => unfollowDisplayedUser(event)}
                    >
                      {presenter.isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) => followDisplayedUser(event)}
                    >
                      {presenter.isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow </div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
