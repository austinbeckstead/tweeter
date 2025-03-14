import "./MainLayout.css";
import { Outlet } from "react-router-dom";
import AppNavbar from "../appNavbar/AppNavbar";
import PostStatus from "../postStatus/PostStatus";
import UserInfo from "../userInfo/UserInfo";
import {
  UserInfoPresenter,
  UserInfoView,
} from "../../presenter/UserInfoPresenter";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../presenter/PostStatusPresenter";
import {
  LogoutUserView,
  LogoutUserPresenter,
} from "../../presenter/LogoutUserPresenter";

const MainLayout = () => {
  return (
    <>
      <AppNavbar
        presenterGenerator={(view: LogoutUserView) =>
          new LogoutUserPresenter(view)
        }
      />
      <div className="container mx-auto px-3 w-100">
        <div className="row gx-4">
          <div className="col-4">
            <div className="row gy-4">
              <div className="p-3 mb-4 border rounded bg-light">
                <UserInfo
                  presenterGenerator={(view: UserInfoView) =>
                    new UserInfoPresenter(view)
                  }
                />
              </div>
              <div className="p-3 border mt-1 rounded bg-light">
                <PostStatus />
              </div>
            </div>
          </div>
          <div className="col-8 px-0">
            <div className="bg-white ms-4 w-100">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
