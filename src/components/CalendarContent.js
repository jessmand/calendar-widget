import React from 'react';
import { connect } from 'react-redux';
import { meetingsSelector } from '../selectors/MeetingsSelectors';
import { DAYS_OF_THE_WEEK } from '../constants/constants';
import Day from './Day';
import Meeting from './Meeting';

class CalendarContent extends React.Component {
  renderMeetings() {
    const { meetings } = this.props;

    return Object.keys(meetings).map(index => {
      return (
        <Meeting key={`meeting-${index}`} index={index} {...meetings[index]} />
      );
    });
  }

  renderDays() {
    return DAYS_OF_THE_WEEK.map(day => {
      return <Day key={`${day.name}-${day.index}`} day={day} />;
    });
  }

  render() {
    return (
      <div className="calendar__content-container">
        <div className="calendar__content">
          {this.renderDays()}
          {this.renderMeetings()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { meetings: meetingsSelector(state) };
};

export default connect(mapStateToProps)(CalendarContent);
