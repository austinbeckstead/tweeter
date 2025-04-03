import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";

import {
  PagedItemPresenter,
  PagedItemView,
} from "../../presenter/PagedItemPresenter";
import { User } from "tweeter-shared";

interface Props<T, U> {
  presenterGenerator: (view: PagedItemView<T>) => PagedItemPresenter<T, U>;
  itemComponentGenerator: (item: T) => JSX.Element;
}

const ItemScroller = <T, U>(props: Props<T, U>) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<T[]>([]);
  const [newItems, setNewItems] = useState<T[]>([]);

  //const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

  const { displayedUser, authToken } = useUserInfo();
  const prevUser = useRef<User | null>(null);
  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    if (displayedUser !== prevUser.current) {
      prevUser.current = displayedUser;
      reset();
    }
  }, [displayedUser]);

  // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
  /*useEffect(() => {
    if (changedDisplayedUser) {
      console.log("TRIGGERED BECAUSE OF CHANGE USER");
      loadMoreItems();
    }
  }, [changedDisplayedUser]);*/

  // Add new items whenever there are new items to add
  useEffect(() => {
    if (newItems) {
      setItems([...items, ...newItems]);
    }
  }, [newItems]);

  const reset = async () => {
    console.log("RESET");
    setItems([]);
    setNewItems([]);
    presenter.reset();
    await loadMoreItems();
    //setChangedDisplayedUser(true);
  };

  const listener: PagedItemView<T> = {
    addItems: (newItems: T[]) => setNewItems(newItems),
    displayErrorMessage: displayErrorMessage,
  };
  const [presenter] = useState(props.presenterGenerator(listener));

  const loadMoreItems = async () => {
    console.log("LOADING MORE ITEMS");
    await presenter.loadMoreItems(authToken!, displayedUser!);
    //setChangedDisplayedUser(false);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            {props.itemComponentGenerator(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
