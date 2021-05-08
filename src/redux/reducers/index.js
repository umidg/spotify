import { combineReducers } from "redux";
import { listReducer } from "./listReducer";
const reducers = combineReducers({
  allLists: listReducer,
});

export default reducers;
