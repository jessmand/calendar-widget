export const meetingsSelector = state => {
  return state.meetings;
};

export const meetingOverlapsSelector = (state, meetingIndex) => {
  const meetings = meetingsSelector(state);

  return Object.keys(meetings).filter(compareIndex => {
    const meetingDayIndex = meetings[meetingIndex].day.index;
    const compareDayIndex = meetings[compareIndex].day.index;

    if (meetingDayIndex !== compareDayIndex) return false;

    const meetingTimeIndex = meetings[meetingIndex].time.index;
    const compareTimeIndex = meetings[compareIndex].time.index;
    const meetingLength = meetings[meetingIndex].length;
    const compareLength = meetings[compareIndex].length;

    const meetingTimeValues = [...Array(meetingLength).keys()].map(
      x => x + meetingTimeIndex
    );
    const compareTimeValues = [...Array(compareLength).keys()].map(
      x => x + compareTimeIndex
    );

    return (
      meetingTimeValues.filter(value => -1 !== compareTimeValues.indexOf(value))
        .length > 0
    );
  });
};
