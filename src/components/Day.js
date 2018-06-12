import React from 'react';
import { connect } from 'react-redux';
import { TIME_BLOCKS } from '../constants/constants';
import { createMeeting } from '../actions/MeetingsActions';

class Day extends React.Component {
  constructor() {
    super();

    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  handleMouseDown(e, time) {
    const { day, dispatchCreateMeeting } = this.props;

    const length = 1;

    dispatchCreateMeeting({ day, time, length });
  }

  render() {
    const { day } = this.props;

    return (
      <div className="calendar__day">
        {TIME_BLOCKS.map(time => {
          return (
            <div
              key={`${day.name}-${time.name}`}
              onMouseDown={e => this.handleMouseDown(e, time)}
              onMouseOver={this.handleMouseEnter}
              className="calendar__half-hour-block"
            />
          );
        })}
      </div>
    );
  }
}

const mapDispatchToProps = {
  dispatchCreateMeeting: createMeeting
};

export default connect(
  undefined,
  mapDispatchToProps
)(Day);
