import { combineReducers } from 'redux';
import meetings from './Meetings';
import meetingsIndex from './MeetingsIndex';

export default combineReducers({
  meetings,
  meetingsIndex
});
