import { ActionTypes } from "../constants/action-types";

const intitialState = {
  lists: [{ id: "1" }],
};

export const listReducer = (state = intitialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_LIST:
      return state;
      break;

    default:
      return state;
  }
};
