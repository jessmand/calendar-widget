// Adapted from react-resizable: https://github.com/STRML/react-resizable/blob/master/lib/Resizable.js

import React from 'react';
import { connect } from 'react-redux';
import {
  editMeetingLength,
  setMeetingNotNew
} from '../actions/MeetingsActions';
import { DraggableCore } from 'react-draggable';
import X from 'react-icons/lib/go/x';

class MeetingCreator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resizing: false,
      height: this.props.height,
      slackH: 0
    };

    this.resizeHandler = this.resizeHandler.bind(this);
    this.handleStopCreate = this.handleStopCreate.bind(this);
    this.initializeDrag = this.initializeDrag.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.resizing && nextProps.height !== this.props.height) {
      this.setState({
        height: nextProps.height
      });
    }
  }

  handleStopCreate() {
    const {
      dispatchSetMeetingNotNew,
      dispatchEditMeetingLength,
      handleStartEditing,
      index
    } = this.props;
    const { height } = this.state;

    dispatchEditMeetingLength(index, (height + 2) / 20);
    dispatchSetMeetingNotNew(index);
    handleStartEditing();
  }

  resizeHandler(handlerName) {
    return (e, { node, deltaY }) => {
      let height = this.state.height + deltaY;

      // Early return if no change
      const heightChanged = height !== this.state.height;
      if (handlerName === 'onResize' && !heightChanged) return;

      // Set the appropriate state for this handler.
      const newState = {};
      if (handlerName === 'onResizeStart') {
        newState.resizing = true;
      } else if (handlerName === 'onResizeStop') {
        newState.resizing = false;
        newState.slackH = 0;
      } else {
        // Early return if no change after constraints
        if (height === this.state.height) return;
        newState.height = height;
      }

      const hasCb = typeof this.props[handlerName] === 'function';
      if (hasCb) {
        if (typeof e.persist === 'function') e.persist();
        this.setState(newState, () =>
          this.props[handlerName](e, { node, size: { height } })
        );
      } else {
        this.setState(newState);
      }
    };
  }

  initializeDrag(e, data) {
    const { resizing } = this.state;
    if (resizing) return;
    this.draggable.handleDragStart(e);
  }

  render() {
    const { style } = this.props;
    const { height } = this.state;

    return (
      <div style={style} className="calendar__meeting">
        <div
          style={{
            height
          }}
          className="calendar__meeting-content"
          onMouseOver={this.initializeDrag}
        >
          <X className="calendar__meeting-remove" />
          <DraggableCore
            grid={[undefined, 20]}
            key="resizableHandle"
            ref={draggable => (this.draggable = draggable)}
            onStop={() => {
              this.resizeHandler('onResizeStop').bind(this);
              this.handleStopCreate();
            }}
            onDrag={this.resizeHandler('onResize').bind(this)}
          >
            <span className="react-resizable-handle" />
          </DraggableCore>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  dispatchEditMeetingLength: editMeetingLength,
  dispatchSetMeetingNotNew: setMeetingNotNew
};

export default connect(
  undefined,
  mapDispatchToProps
)(MeetingCreator);
