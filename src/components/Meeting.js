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
import Pencil from 'react-icons/lib/go/pencil';
import X from 'react-icons/lib/go/x';
import Check from 'react-icons/lib/go/check';
import Textarea from 'react-textarea-autosize';
import { TIME_BLOCKS, DAYS_OF_THE_WEEK } from '../constants/constants';
import Draggable from 'react-draggable';

class Meeting extends React.Component {
  constructor(props) {
    super(props);
    const { isNew } = props;

    this.state = {
      isChangingLength: isNew,
      isEditingName: false
    };

    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleEditName = this.handleEditName.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleStartEditing = this.handleStartEditing.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
  }

  handleMouseLeave(e) {
    const { isChangingLength } = this.state;
    const { dispatchEditMeetingLength, index, length } = this.props;

    if (isChangingLength) {
      const meetingTop = e.target.offsetParent.offsetTop + e.target.offsetTop;
      const mouseY = e.clientY;
      const meetingHeight = e.target.offsetHeight;

      if (mouseY >= meetingTop + meetingHeight) {
        dispatchEditMeetingLength(index, length + 1);
      }
    }
  }

  // TODO: attach a mouseup handler to the window
  // so that drag also stops onMouseUp outside
  // of meeting element
  handleMouseUp() {
    const { isNew, index, dispatchSetMeetingNotNew } = this.props;

    console.log('mouse up');

    this.setState({
      isChangingLength: false
    });

    if (isNew) {
      dispatchSetMeetingNotNew(index);
      this.handleStartEditing();
    }
  }

  handleMouseMove(e) {
    const { isChangingLength } = this.state;
    const { dispatchEditMeetingLength, index, length } = this.props;

    if (!isChangingLength) return;
    const meetingTop = e.target.offsetParent.offsetTop + e.target.offsetTop;
    const mouseY = e.clientY;
    const meetingHeight = e.target.offsetHeight;

    if (mouseY <= meetingTop + meetingHeight - 20) {
      dispatchEditMeetingLength(index, length - 1);
    }
  }

  handleRemove() {
    const { index, dispatchRemoveMeeting } = this.props;

    dispatchRemoveMeeting(index);
  }

  handleNameFocus(e) {
    e.target.select();
  }

  handleEditName(e) {
    const { dispatchEditMeetingName, index } = this.props;

    dispatchEditMeetingName(index, e.target.value);
  }

  handleStartEditing() {
    this.setState(
      {
        isEditingName: true
      },
      () => this.nameInput.focus()
    );
  }

  handleSave() {
    this.setState({
      isEditingName: false
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSave();
    }
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
    const { isNew, name } = this.props;
    const { isEditingName } = this.state;

    if (isNew) {
      return (
        <div
          onMouseLeave={this.handleMouseLeave}
          onMouseMove={this.handleMouseMove}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          style={{
            height: this.getHeight(),
            left: this.getCoordinates().x,
            top: this.getCoordinates().y
          }}
          className="calendar__meeting"
        >
          <div className="calendar__meeting-content">
            <X className="calendar__meeting-remove" />
          </div>
        </div>
      );
    }

    const editButton = isEditingName ? (
      <Check onClick={this.handleSave} className="calendar__meeting-save" />
    ) : (
      <Pencil
        onClick={this.handleStartEditing}
        className="calendar__meeting-edit"
      />
    );

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
          <div className="calendar__meeting-content">
            <Textarea
              className="calendar__meeting-title"
              inputRef={input => {
                this.nameInput = input;
              }}
              onFocus={this.handleNameFocus}
              value={name}
              onChange={this.handleEditName}
              disabled={!isEditingName}
              onKeyPress={this.handleKeyPress}
            />
            {isNew ? null : editButton}
            <X
              onClick={this.handleRemove}
              className="calendar__meeting-remove"
            />
          </div>
        </div>
      </Draggable>
    );
  }
}

const mapDispatchToProps = {
  dispatchEditMeetingLength: editMeetingLength,
  dispatchRemoveMeeting: removeMeeting,
  dispatchSetMeetingNotNew: setMeetingNotNew,
  dispatchEditMeetingName: editMeetingName,
  dispatchEditMeetingTime: editMeetingTime,
  dispatchEditMeetingDay: editMeetingDay
};

export default connect(
  undefined,
  mapDispatchToProps
)(Meeting);
