import React from 'react';
import { withRouter } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ioosLogo from './logos/ioos_logo.png';
import { library } from '@fortawesome/fontawesome-svg-core';
import Routes from './Routes';
import { faSpinner, faArrowCircleUp, faArrowCircleDown, faBell, faHome, faSignOutAlt, faInfoCircle, faPlayCircle, faPauseCircle, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import './App.scss';

library.add(faSpinner);
library.add(faArrowCircleUp);
library.add(faArrowCircleDown);
library.add(faHome);
library.add(faBell);
library.add(faSignOutAlt);
library.add(faInfoCircle);
library.add(faPlayCircle);
library.add(faPauseCircle);
library.add(faExternalLinkAlt);


function App() {
  return (
    <div className="App">
      {/* <Navbar bg="light" variant="light" expand="lg" fluid collapseOnSelect>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Navbar.Brand href="https://ioos.us">
            <img
              alt={'IOOS Logo'}
              src={ioosLogo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            IOOS Sensor Streaming
          </Navbar.Brand>
        </Navbar.Collapse>
      </Navbar> */}
      <Routes/>
    </div>

  );
}

export default withRouter(App);
