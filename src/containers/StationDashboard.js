import React, { Component } from 'react';
import moment from 'moment';
import {Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import GaugePlot from '../components/GaugePlot';
import InfoPopover from '../components/InfoPopover';
import {TimeSeriesPlot} from '../components/TimeSeriesPlot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GLMap from '../components/Map';
import Cards from '../components/Cards';
import LoaderButton from '../components/LoaderButton';
import LedIndicator from '../components/LedIndicator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './StationDashboard.css';
import '../components/Cards.scss';

const FEATURED_PARAM = 'airtemp';



export default class StationDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingData: true,
      data: null,
      stream: [],
      station: '',
      tableColumns: [],
      tableData: [],
      selected: [FEATURED_PARAM],
      alert: false,
      alertMessage: '',
      isConnected: false,
      connection: null
    };

    this.blacklistParams = ['timestamp', 'date', 'station', 'topic', 'id', 'lat', 'lon'];

    this.parameterMapping = {
      baro_press: 'Barometric Pressure (mmHg)',
      airtemp: 'Air Temperature (°F)',
      wind_direction: 'Wind Direction (deg True)',
      wind_speed: 'Wind Speed (kts)',
    };
  }
  clearData = async event => this.setState({stream: []});

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
          let self = this;
          let jsonStreams = JSON.parse(e.data);
          if (!Array.isArray(jsonStreams)) {
            return;
          }

          let thisStation = this.props.match.params.id;
          let filteredStream = jsonStreams.filter(function(item){
            return item.datatype === thisStation && item.datasubtype === '$WIMDA';
          });

          if (filteredStream.length === 0) return null;
          // Check the stream for the correct station
          let station = filteredStream[0].datatype;
          if (station !== thisStation) {
            return null;
          }
          // Parse the message into an object
          // TODO: this shouldnt be hardcoded\
          let timestamp = filteredStream[0].date;  //String: "2020-10-07T14:59:58.665128"
          let message = filteredStream[0].message.split(',');
          let transformedStream = [{
            timestamp: moment(timestamp).valueOf() / 1000.,  // s since epoch
            baro_press: parseFloat(message[1]),  // mmHg
            airtemp: message[5] && (parseFloat(message[5]) * 9/5) + 32,  // degF
            wind_direction: parseFloat(message[13]),  // True
            wind_speed: parseFloat(message[17]),  //knots
            id: filteredStream[0].datatype,
            lat: 44 + 53.7084 / 60,
            lon: -(68 + 39.9878/ 60)
          }];
          let stream = transformedStream.concat(this.state.stream);

          // Define function to sort array of objects
          const sortByKey = (array, key) => {
            return array.sort(function(a, b) {
              let x = a[key];
              let y = b[key];
              return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
          }
          stream = sortByKey(stream, 'timestamp').reverse();

          this.setState({
            stream: stream,
            station: station
          });
        }
      } catch (e) {
        alert(e.message);
        this.setState({ isLoading: false });
      }
    } else {
      this.state.connection.close()
      this.setState({ isConnected: false, isLoading: false});
    }
  };

  async _fetchData(url) {
    try {
      let resp = await fetch(url);
      if (!resp.ok) {
        throw new Error();
      }
      let data = await resp.json();
      return data;
    } catch (err) {
      throw new Error(`Failed to load data: ${err}`);
    }
  }

  _fetchStream() {
    const {data} = this.state;

    const url = 'wss://9f50kdhxci.execute-api.us-east-1.amazonaws.com/DEV';
    const connection = new WebSocket(url);

    // const movingStats = new MovingStats();

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
      // connection.send(message);
    }
    connection.onmessage = e => {
      let self = this;
      let jsonStreams = JSON.parse(e.data);
      if (!Array.isArray(jsonStreams)) {
        return;
      }

      let thisStation = this.props.match.params.id;
      let filteredStream = jsonStreams.filter(function(item){
        return item.datatype === thisStation && item.datasubtype === '$WIMDA';
      });

      if (filteredStream.length === 0) return null;
      // Check the stream for the correct station
      let station = filteredStream[0].datatype;
      if (station !== thisStation) {
        return null;
      }
      // Parse the message into an object
      // TODO: this shouldnt be hardcoded\
      let timestamp = filteredStream[0].date;  //String: "2020-10-07T14:59:58.665128"
      let message = filteredStream[0].message.split(',');
      let transformedStream = [{
        timestamp: moment(timestamp).valueOf() / 1000.,  // s since epoch
        baro_press: parseFloat(message[1]),  // mmHg
        airtemp: message[5] && (parseFloat(message[5]) * 9/5) + 32,  // degF
        wind_direction: parseFloat(message[13]),  // True
        wind_speed: parseFloat(message[17]),  //knots
        id: filteredStream[0].datatype,
        lat: 44 + 53.7084 / 60,
        lon: -(68 + 39.9878/ 60)
      }];
      let stream = transformedStream.concat(this.state.stream);

      // Define function to sort array of objects
      const sortByKey = (array, key) => {
        return array.sort(function(a, b) {
          let x = a[key];
          let y = b[key];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
      }
      stream = sortByKey(stream, 'timestamp').reverse();

      this.setState({
        stream: stream,
        station: station
      });
    }
  }

  _buildTable() {
    let self = this;
    // Format data for react-bootstrap-table2
    const formatWithIcon = (cell, row, rowIndex, formatExtraData) => {
      let icon = 'arrow-circle-up';
      if (cell === 'down') {
        icon = 'arrow-circle-down';
      }
      return(
        <span><FontAwesomeIcon icon={icon} style={{'marginRight': '7px'}}/></span>
      )
    }

    let tableColumns = [
      {
        dataField: 'parameter',
        text: 'Parameter',
        sort: true,
        hidden: true
      },
      {
        dataField: 'prettyName',
        text: 'Parameter',
        sort: true,
      },
      // {
      //   dataField: 'trend',
      //   text: 'Trend',
      //   sort: true,
      //   formatter: formatWithIcon,
      //   formatExtraData: formatWithIcon,
      // }
    ];
    let alert = false;
    let alertMessage = '';
    let stream = Array.from(this.state.stream);;

    if (stream.length >= 5) {
      stream = stream.slice(0, 5);
    }

    var timestamp = 'timestamp';

    // Check the stream for the correct station
    // let station = jsonStream.station;
    // if (station !== thisStation) {
    //   return null;
    // }


    // Check the stream for repeated record
    // let ts = jsonStream[timestamp];
    // let timestamps = [];
    // this.state.stream.map((obj, idx) => {return timestamps.push(obj[timestamp])});
    // if (ts in timestamps) {
    //   return null;
    // }

    let featuredData = stream[0][FEATURED_PARAM];

    if (featuredData > 20) {
      alert = true;
      alertMessage = 'This station is currently detecting Blue Green Algae values that could indicate the presence of a HAB.';
    }

    stream.map((obj, idx) => {
      return tableColumns.push({
        dataField: obj[timestamp].toString(),
        text: moment.unix(obj[timestamp]).format("ddd MMM DD YYYY HH:mm:ss"),
      });
    });

    let tableData = [];
    let paramRows = Object.keys(stream[0]);
    let rowObj = {};
    paramRows = paramRows.filter(item => !this.blacklistParams.includes(item));
    paramRows.map((param, idx) => {
      rowObj = {
        prettyName: param in self.parameterMapping ? self.parameterMapping[param] : param,
        parameter: param
      };
      stream.map((obj, ind) => {
        let val = obj[param];
        console.log(val)
        return rowObj[obj[timestamp]] = val.toFixed(2);
      });
      return tableData.push(rowObj);
    });

    return {
      tableColumns: tableColumns,
      tableData: tableData,
    };
  }

  parseStations(dataFeatures) {
    return dataFeatures.features.map(feature => feature.properties.metadata.id) || [];
  }

  async componentDidMount() {
    // if (!this.props.isAuthenticated) {
    //   return;
    // }

    this.setState({loadingData: false, dataLoadingError: false});
    // this._fetchStream();
  }

  renderLander() {
    return (
      <div className="station-lander">
        <h1>Loading Data...</h1>
        <FontAwesomeIcon icon='spinner' size='4x' spin />
      </div>
    );
  }

  _renderAlert() {
    const {alert, alertMessage} = this.state;
    if (!alert) {
      return null;
    }
    return (
      <div>
        <Alert variant="warning">
          <Alert.Heading>Warning!</Alert.Heading>
          <p>
            {alertMessage}
          </p>
        </Alert>
      </div>
    )
  }

  _renderMap() {
    // TODO: need to show UI indication that map is loading (logic belongs in Map component)
    let thisStation = this.props.match.params.id;
    const {stream} = this.state;
    return (
      <div className='dashboard-map-container'><GLMap station={thisStation} data={stream[0]}/></div>
    )
  }

  _renderGauge() {
    const {stream} = this.state;
    let thisStation = this.props.match.params.id;
    if (stream.length === 0) {
      return null;
    }

    let params = ['wind_speed', 'baro_press'];
    return (
      <div>
        <Row>
          {params.map((param, idx) => {
            let timeParam = 'timestamp'
            let dataPoint = stream[0][param];
            return <Col xs={12} lg={6}><GaugePlot dataPoint={dataPoint} parameter={this.parameterMapping[param]}/></Col>
          })}
        </Row>
      </div>
    );
  }

  _renderTimeSeriesPlot() {
    const {stream, selected} = this.state;
    if (stream.length === 0) {
      return null;
    }
    const colors = ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"];
    return (
      <div>
        {selected.map((param, idx) => {
          return <TimeSeriesPlot key={param} stream={stream} parameters={[param]} parameterMapping={this.parameterMapping} color={colors[idx % colors.length]}/>
        })}
      </div>
    );
  }


  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row.parameter]
      }));
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.parameter)
      }));
    }
  };

  handleOnSelectAll = (isSelect, rows) => {
    const params = rows.map(r => r.parameter);
    if (isSelect) {
      this.setState(() => ({
        selected: params
      }));
    } else {
      this.setState(() => ({
        selected: []
      }));
    }
  };

  handleClick(selected){
    this.setState({
      selected: selected
    });
  }

  _renderCards(data) {
    const {stream} = this.state;
    let params = [];

    Object.keys(stream[0]).filter(item => !this.blacklistParams.includes(item)).map((key, idx) => {
      return params.push({
        title: key in this.parameterMapping ? this.parameterMapping[key] : key,
        description: stream[0][key],
        id: key
      });
    });

    params = params.filter(item => !this.blacklistParams.includes(item));
    let selectedParams = params.map((param, idx) => {
      return this.state.selected.indexOf(param.id) > -1 ? idx : null;
    }).filter(x => x !== null);

    return (
      <Cards
        title=""
        selected={selectedParams}
        cardContents={params}
        maxSelectable={999}
        onChange={this.handleClick.bind(this)}
      />
    )
  }

  renderDashboard() {
    const {stream, station} = this.state;
    let thisStation = this.props.match.params.id;

    if (station !== thisStation) {
      this.setState({
        stream: [],
        station: thisStation
      });
    }

    // if (stream.length === 0) {
    //   return (
    //     this.renderLander()
    //   )
    // }

    let lastUpdate = stream.length > 0 ? moment.unix(this.state.stream[0]['timestamp']).format("ddd MMM DD YYYY hh:mm:ss a") : 'Unknown';
    let popoverContent = ('This is a real time sensor.');
    return (
      <div className="home-container">
        {this._renderAlert()}
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
        </form>
        {stream.length > 0 && (
          <div>
          <Row>
            <Col sm={6}>
              <h2 align='left'>Station - {thisStation}
                <InfoPopover content={popoverContent} />
              </h2>
              <h5 align='left'>Last Updated - {lastUpdate}</h5>
              <div>
                {this._renderGauge()}
              </div>
            </Col>
            <Col sm={6}>
              <div>
                {this._renderMap()}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <div id="cards">
                {this._renderCards()}
              </div>
              <div id="plot" style={{marginBottom: '100px'}}>
                {this._renderTimeSeriesPlot()}
              </div>
            </Col>
          </Row>
          </div>
        )}
      </div>
    )
  }

  render() {
    let thisStation = this.props.match.params.id;

    // if (this.state.loadingData) {
    //   return <>{this.renderLander()}</>
    // }

    return <div className="Home">{this.renderDashboard()}</div>;
  }
}
