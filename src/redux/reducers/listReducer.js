import { initial } from "lodash";
import { ActionTypes } from "../constants/action-types";
import { loadstate } from "../localstorage";
const intitialState = {
  lists:
    loadstate() && loadstate().lists && loadstate().lists.length
      ? loadstate().lists
      : [],
};

export const listReducer = (state = intitialState, { type, payload }) => {
  console.log(loadstate(), intitialState, "load");
  switch (type) {
    case ActionTypes.SET_LIST:
      return { ...state, lists: payload };
    default:
      return state;
  }
};
