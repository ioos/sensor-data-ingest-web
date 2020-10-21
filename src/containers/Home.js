import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import {Form} from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import LoaderButton from '../components/LoaderButton';
import LedIndicator from '../components/LedIndicator';
import './Home.css';


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isConnected: false,
      stream: '',
      connection: null
    };
  }

  async componentDidMount() {
  }

  clearData = async event => this.setState({stream: ''});

  handleConnect = async event => {
    event.preventDefault();
    this.setState({isLoading: true});

    if (!this.state.isConnected) {

      try {
        const url = 'wss://9f50kdhxci.execute-api.us-east-1.amazonaws.com/DEV';
        let connection = new WebSocket(url);

        connection.onerror = e => {
          console.error('Stream Connection Error');
          return (
            <div>
              <Alert variant="danger">
                <Alert.Heading>Error!</Alert.Heading>
                <p>
                  Error connecting to Stream
                </p>
              </Alert>
            </div>
          )
        }

        connection.onopen = e => {
          const message = JSON.stringify({action: 'history'});
          connection.send(message);
          this.setState({ isLoading: false, isConnected: true, connection: connection });
        }
        connection.onmessage = e => {
          let stream = e.data + '\n\n' + this.state.stream;
          this.setState({
            stream: stream
          });
        }
      } catch (e) {
        alert(e.message);
        this.setState({ isLoading: false });
      }
    } else {
      this.state.connection.close()
      this.setState({ isConnected: false, isLoading: false });
    }
  };

  renderLander() {
    return (
      <div className='lander'>
        <div className='jumbotron jumbotron-fluid'>
          <div className="container">
            <h1>IOOS Sensor Streaming</h1>
            <h2>Prototype</h2>
            <Container>
              <form onSubmit={this.handleConnect}>
                <Row style={{paddingTop: '20px'}}>
                  <Col sm={4}/>
                  <Col xs={6} sm={4}>
                    <LoaderButton
                      block
                      bsSize="large"
                      bsStyle="info"
                      type="submit"
                      isLoading={this.state.isLoading}
                      text={this.state.isConnected ? ("Disconnect") : ("Connect")}
                      loadingText="Connecting..."
                    />
                  </Col>
                  <Col sm={1}>
                    <LedIndicator className={this.state.isConnected ? ("led-on") : ("led-off")} />
                  </Col>
                  <Col sm={3}/>
                </Row>
                <Row style={{paddingTop: '20px'}}>
                  <Col sm={1}/>
                  <Col sm={10}>
                    <Form.Label>Sensor Data:</Form.Label>
                    <Form.Control readOnly placeholder={this.state.stream}as="textarea" rows="10" />
                  </Col>
                  <Col sm={1}/>
                </Row>
                <Button
                  as="input"
                  variant="secondary"
                  size="sm"
                  type="button"
                  value="Clear"
                  onClick={this.clearData}
                />
              </form>

            </Container>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return <div className='Home'>{this.renderLander()}</div>;
  }
}
