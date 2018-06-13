import React from 'react';
import { connect } from 'react-redux';
import {
  editMeetingLength,
  removeMeeting,
  setMeetingNotNew,
  editMeetingName,
  editMeetingTime,
  editMeetingDay
} from '../actions/MeetingsActions';
import { TIME_BLOCKS, DAYS_OF_THE_WEEK } from '../constants/constants';
import Draggable from 'react-draggable';
import MeetingCreator from './MeetingCreator';
import MeetingContent from './MeetingContent';

class Meeting extends React.Component {
  constructor(props) {
    super(props);
    const { isNew } = props;

    this.state = {
      isChangingLength: isNew,
      isEditingName: false
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleStartEditing = this.handleStartEditing.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
  }

  handleStartEditing() {
    this.setState(
      {
        isEditingName: true
      },
      this.meetingContent.getWrappedInstance().focusOnName
    );
  }

  handleSave() {
    this.setState({
      isEditingName: false
    });
  }

  getHeight() {
    const { length } = this.props;
    return length * 20 - 2;
  }

  getCoordinates() {
    const { day, time } = this.props;

    const left = day.index * 110 + 1;
    const top = time.index * 20 + 1;

    return {
      x: left,
      y: top
    };
  }

  handleDragStop(e, data) {
    const {
      dispatchEditMeetingTime,
      dispatchEditMeetingDay,
      index,
      time,
      day
    } = this.props;

    const prevCoordinates = this.getCoordinates();
    const newCoords = data.node.getBoundingClientRect();

    const yDiff = Math.floor(
      (newCoords.y - data.node.offsetParent.offsetTop - prevCoordinates.y) / 20
    );
    const xDiff = Math.floor(
      (newCoords.x +
        0.5 -
        data.node.offsetParent.offsetLeft -
        prevCoordinates.x) /
        110
    );

    if (yDiff !== 0) {
      dispatchEditMeetingTime(index, TIME_BLOCKS[time.index + yDiff]);
    }

    if (xDiff !== 0) {
      dispatchEditMeetingDay(index, DAYS_OF_THE_WEEK[day.index + xDiff]);
    }
  }

  render() {
    const { isNew, name, index } = this.props;
    const { isEditingName } = this.state;

    if (isNew) {
      return (
        <MeetingCreator
          height={this.getHeight()}
          style={{
            left: this.getCoordinates().x,
            top: this.getCoordinates().y,
            width: 90
          }}
          index={index}
          onDragEnd={this.handleFinishCreate}
          handleStartEditing={this.handleStartEditing}
        />
      );
    }

    return (
      <Draggable
        grid={[110, 20]}
        onStop={this.handleDragStop}
        defaultPosition={this.getCoordinates()}
      >
        <div
          style={{
            height: this.getHeight()
          }}
          className="calendar__meeting"
        >
          <MeetingContent
            name={name}
            index={index}
            isEditingName={isEditingName}
            handleStartEditing={this.handleStartEditing}
            handleSave={this.handleSave}
            ref={meetingContent => {
              this.meetingContent = meetingContent;
            }}
          />
        </div>
      </Draggable>
    );
  }
}

const mapDispatchToProps = {
  dispatchEditMeetingTime: editMeetingTime,
  dispatchEditMeetingDay: editMeetingDay
};

export default connect(
  undefined,
  mapDispatchToProps
)(Meeting);
