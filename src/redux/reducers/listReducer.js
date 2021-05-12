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
  switch (type) {
    case ActionTypes.SET_LIST:
      console.log("reduced ");
      return { ...state, lists: payload };
    default:
      return state;
  }
};
