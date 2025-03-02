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
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { StoryItemPresenter } from "./presenter/StoryItemPresenter";
import { FeedItemPresenter } from "./presenter/FeedItemPresenter";
import { RegisterUserPresenter } from "./presenter/RegisterUserPresenter";
import { LoginUserPresenter } from "./presenter/LoginUserPresenter";
import { UserView } from "./presenter/UserPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import UserItem from "./components/userItem/UserItem";
import { PagedItemView } from "./presenter/PagedItemPresenter";
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
      <Route path="/login" element={<Login />} />
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
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
