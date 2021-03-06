import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import Modal from "react-bootstrap/Modal";
import { GlobalHotKeys } from "react-hotkeys";
import { connect } from "react-redux";

import ConditionalRender from "../ConditionalRender";
import { closeChart } from "../actions/charts";
import { buildRangeState } from "../dtale/rangeSelectUtils";
import DraggableModalDialog from "./DraggableModalDialog";
import * as popupUtils from "./popupUtils";

class ReactPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: "" };
  }

  shouldComponentUpdate(newProps) {
    if (!_.isEqual(this.props, newProps)) {
      return true;
    }
    // Otherwise, use the default react behaviour.
    return false;
  }

  render() {
    const { chartData } = this.props;
    const { type, visible, size, backdrop } = chartData;
    const onClose = () =>
      this.props.propagateState(buildRangeState(), () => this.props.onClose({ size: size || "lg" }));
    const { title, body } = popupUtils.buildBodyAndTitle(this.props);
    return (
      <Modal
        {...{
          show: visible,
          onHide: onClose,
          dialogAs: DraggableModalDialog,
          size: size || "lg",
          backdrop: backdrop ?? "static",
          dialogClassName: `${type}-modal`,
        }}>
        {visible && <GlobalHotKeys keyMap={{ CLOSE_MODAL: "esc" }} handlers={{ CLOSE_MODAL: onClose }} />}
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <ConditionalRender display={visible}>{body}</ConditionalRender>
      </Modal>
    );
  }
}
ReactPopup.displayName = "Popup";
ReactPopup.propTypes = {
  onClose: PropTypes.func,
  dataId: PropTypes.string.isRequired,
  chartData: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
    type: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.string,
    backdrop: PropTypes.bool,
    selectedCol: PropTypes.string,
    rowIndex: PropTypes.number,
  }),
  propagateState: PropTypes.func,
};

const ReduxPopup = connect(
  state => _.pick(state, ["dataId", "iframe", "chartData"]),
  dispatch => ({ onClose: chartData => dispatch(closeChart(chartData || {})) })
)(ReactPopup);

export { ReactPopup, ReduxPopup as Popup };
