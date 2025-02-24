import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { Status, User } from "tweeter-shared";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { StoryItemPresenter } from "./presenters/StoryItemPresenter";
import { FeedItemPresenter } from "./presenters/FeedItemPresenter";
import { RegisterUserPresenter } from "./presenters/RegisterUserPresenter";
import { LoginUserPresenter } from "./presenters/LoginUserPresenter";
import { UserView } from "./presenters/UserPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import UserItem from "./components/userItem/UserItem";
import { PagedItemView } from "./presenters/PagedItemPresenter";
import StatusItem from "./components/statusItem/StatusItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <ItemScroller
              key={1}
              presenterGenerator={(view: PagedItemView<Status>) =>
                new FeedItemPresenter(view)
              }
              itemComponentGenerator={(status: Status) => (
                <StatusItem status={status} />
              )}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller
              key={2}
              presenterGenerator={(view: PagedItemView<Status>) =>
                new StoryItemPresenter(view)
              }
              itemComponentGenerator={(status: Status) => (
                <StatusItem status={status} />
              )}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller
              key={3}
              presenterGenerator={(view: PagedItemView<User>) =>
                new FolloweePresenter(view)
              }
              itemComponentGenerator={(user: User) => <UserItem value={user} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key={4}
              presenterGenerator={(view: PagedItemView<User>) =>
                new FollowerPresenter(view)
              }
              itemComponentGenerator={(user: User) => <UserItem value={user} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            presenterGenerator={(view: UserView) =>
              new LoginUserPresenter(view)
            }
          />
        }
      />
      <Route
        path="/register"
        element={
          <Register
            presenterGenerator={(view: UserView) =>
              new RegisterUserPresenter(view)
            }
          />
        }
      />
      <Route
        path="*"
        element={
          <Login
            presenterGenerator={(view: UserView) =>
              new LoginUserPresenter(view, location.pathname)
            }
          />
        }
      />
    </Routes>
  );
};

export default App;
