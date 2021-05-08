import { ActionTypes } from "../constants/action-types";

export const setLists = (lists) => {
  return {
    type: ActionTypes.SET_LISTS,
    payload: lists,
  };
};

export const selectedlist = (lists) => {
  return {
    type: ActionTypes.SELECTED_LISTS,
    payload: lists,
  };
};

export const removeSelectedlist = (lists) => {
  return {
    type: ActionTypes.REMOVE_SELECTED_LISTS,
    payload: lists,
  };
};
