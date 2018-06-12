import ActionTypes from '../constants/ActionTypes';

const initialState = -1;

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.MEETING_CREATED:
      return state + 1;
    default:
      return state;
  }
};
