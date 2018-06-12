import ActionTypes from '../constants/ActionTypes';

const initialState = {};

export default (state = initialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case ActionTypes.MEETING_CREATED:
      newState[action.payload.index] = {
        day: action.payload.day,
        time: action.payload.time,
        length: action.payload.length,
        isNew: true,
        name: 'New meeting'
      };
      return newState;
    case ActionTypes.MEETING_LENGTH_EDITED:
      newState[action.payload.index].length = action.payload.length;
      return newState;
    case ActionTypes.MEETING_TIME_EDITED:
      newState[action.payload.index].time = action.payload.time;
      return newState;
    case ActionTypes.MEETING_DAY_EDITED:
      newState[action.payload.index].day = action.payload.day;
      return newState;
    case ActionTypes.MEETING_NAME_EDITED:
      newState[action.payload.index].name = action.payload.name;
      return newState;
    case ActionTypes.MEETING_NOT_NEW_SET:
      newState[action.payload].isNew = false;
      return newState;
    case ActionTypes.MEETING_REMOVED:
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
};
