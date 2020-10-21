import React from 'react';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';


const popover = props => (
  <Popover id="popover-positioned-bottom">
    <Popover.Content>
      {props.content}
    </Popover.Content>
  </Popover>
);

const InfoPopover = props => (
  <OverlayTrigger trigger="click" placement="bottom" overlay={popover(props)}>
    <FontAwesomeIcon icon='info-circle' style={{'marginLeft': '7px'}} />
  </OverlayTrigger>
);


export default InfoPopover;
