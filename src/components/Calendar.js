import React from 'react';
import CalendarContent from './CalendarContent';
import { DAYS_OF_THE_WEEK, TIME_BLOCKS } from '../constants/constants';

class Calendar extends React.Component {
  renderDayLabels() {
    return DAYS_OF_THE_WEEK.map(day => {
      return (
        <div key={`day-label-${day.index}`} className="calendar__day-label">
          <div className="calendar__day-label-text">
            <span>{day.name}</span>
          </div>
        </div>
      );
    });
  }

  renderTimeLabels() {
    return TIME_BLOCKS.filter((time, index) => index % 2 === 0).map(time => {
      return (
        <div key={`time-label-${time.name}`} className="calendar__time-label">
          <div className="calendar__time-label-text">{time.name}</div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="calendar">
        <div className="calendar__day-label-row">
          <div className="calendar__day-label--placeholder">
            <div className="calendar__day-label--placeholder-text">
              <span>TIME</span>
            </div>
          </div>
          {this.renderDayLabels()}
        </div>
        <div className="calendar__times">{this.renderTimeLabels()}</div>
        <CalendarContent />
      </div>
    );
  }
}

export default Calendar;
