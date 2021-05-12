import { createStore } from "redux";
import { throttle } from "lodash";
import reducers from "./reducers/index";
import { loadstate, saveState } from "./localstorage";

const persistedState = loadstate();

console.log("store");

const store = createStore(
  reducers,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(
  throttle(() => {
    saveState({
      lists: store.getState().allLists.lists,
    });
  }, 500)
);

export default store;
