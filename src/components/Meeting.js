import React from 'react';
import { connect } from 'react-redux';
import { editMeetingTime, editMeetingDay } from '../actions/MeetingsActions';
import { TIME_BLOCKS, DAYS_OF_THE_WEEK } from '../constants/constants';
import Draggable from 'react-draggable';
import MeetingCreator from './MeetingCreator';
import MeetingContent from './MeetingContent';
import { meetingOverlapsSelector } from '../selectors/MeetingsSelectors';

class Meeting extends React.Component {
  constructor(props) {
    super(props);
    const { isNew } = props;

    this.state = {
      isChangingLength: isNew,
      isEditingName: false,
      isDragging: false
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleStartEditing = this.handleStartEditing.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
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

  getWidth() {
    const { meetingOverlaps } = this.props;
    const { isDragging } = this.state;

    if (isDragging) {
      return 150;
    }

    return 150 / meetingOverlaps.length;
  }

  getCoordinates() {
    const { day, time, meetingOverlaps, index } = this.props;
    const { isDragging } = this.state;

    const order = meetingOverlaps.sort().indexOf(index);

    const left =
      day.index * 170 + 1 + (isDragging ? 0 : order * this.getWidth());
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
        170
    );

    if (yDiff !== 0) {
      dispatchEditMeetingTime(index, TIME_BLOCKS[time.index + yDiff]);
    }

    if (xDiff !== 0) {
      dispatchEditMeetingDay(index, DAYS_OF_THE_WEEK[day.index + xDiff]);
    }

    this.setState({
      isDragging: false
    });
  }

  handleDragStart() {
    this.setState({
      isDragging: true
    });
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
            width: this.getWidth()
          }}
          index={index}
          handleStartEditing={this.handleStartEditing}
        />
      );
    }

    return (
      <Draggable
        grid={[170, 20]}
        onStop={this.handleDragStop}
        onStart={this.handleDragStart}
        position={this.getCoordinates()}
      >
        <div
          style={{
            height: this.getHeight(),
            width: this.getWidth()
          }}
          className="calendar__meeting"
        >
          <MeetingContent
            name={name}
            index={index}
            width={this.getWidth()}
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

const mapStateToProps = (state, { index }) => {
  return {
    meetingOverlaps: meetingOverlapsSelector(state, index)
  };
};

const mapDispatchToProps = {
  dispatchEditMeetingTime: editMeetingTime,
  dispatchEditMeetingDay: editMeetingDay
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Meeting);
