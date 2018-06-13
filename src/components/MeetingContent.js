import React from 'react';
import { connect } from 'react-redux';
import X from 'react-icons/lib/go/x';
import Check from 'react-icons/lib/go/check';
import Pencil from 'react-icons/lib/go/pencil';
import Textarea from 'react-textarea-autosize';
import { editMeetingName, removeMeeting } from '../actions/MeetingsActions';

class MeetingContent extends React.Component {
  constructor() {
    super();

    this.handleEditName = this.handleEditName.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.focusOnName = this.focusOnName.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleEditName(e) {
    const { dispatchEditMeetingName, index } = this.props;

    dispatchEditMeetingName(index, e.target.value);
  }

  handleNameFocus(e) {
    e.target.select();
  }

  handleKeyPress(e) {
    const { handleSave } = this.props;
    if (e.key === 'Enter') {
      handleSave();
    }
  }

  handleRemove() {
    const { index, dispatchRemoveMeeting } = this.props;

    dispatchRemoveMeeting(index);
  }

  focusOnName() {
    this.nameInput.focus();
  }

  render() {
    const {
      name,
      isEditingName,
      handleStartEditing,
      handleSave,
      width
    } = this.props;

    return (
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
          style={{
            width: width - 35
          }}
        />
        {isEditingName ? (
          <Check onClick={handleSave} className="calendar__meeting-save" />
        ) : (
          <Pencil
            onClick={handleStartEditing}
            className="calendar__meeting-edit"
          />
        )}
        <X onClick={this.handleRemove} className="calendar__meeting-remove" />
      </div>
    );
  }
}

const mapDispatchToProps = {
  dispatchRemoveMeeting: removeMeeting,
  dispatchEditMeetingName: editMeetingName
};

export default connect(
  undefined,
  mapDispatchToProps,
  null,
  { withRef: true }
)(MeetingContent);
