import ActionTypes from '../constants/ActionTypes';
import { meetingsIndexSelector } from '../selectors/MeetingsIndexSelectors';

export const createMeeting = ({ day, time, length }) => {
  return (dispatch, getState) => {
    const nextMeetingsIndex = meetingsIndexSelector(getState()) + 1;

    dispatch({
      type: ActionTypes.MEETING_CREATED,
      payload: {
        index: nextMeetingsIndex,
        day,
        time,
        length
      }
    });
  };
};

export const editMeetingLength = (index, length) => {
  return {
    type: ActionTypes.MEETING_LENGTH_EDITED,
    payload: { index, length }
  };
};

export const editMeetingTime = (index, time) => {
  return {
    type: ActionTypes.MEETING_TIME_EDITED,
    payload: { index, time }
  };
};

export const editMeetingDay = (index, day) => {
  return {
    type: ActionTypes.MEETING_DAY_EDITED,
    payload: { index, day }
  };
};

export const editMeetingName = (index, name) => {
  return {
    type: ActionTypes.MEETING_NAME_EDITED,
    payload: { index, name }
  };
};

export const removeMeeting = index => {
  return {
    type: ActionTypes.MEETING_REMOVED,
    payload: index
  };
};

export const setMeetingNotNew = index => {
  return {
    type: ActionTypes.MEETING_NOT_NEW_SET,
    payload: index
  };
};
