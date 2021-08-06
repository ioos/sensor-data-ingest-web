import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { StaticMap, InteractiveMap, ReactMapGL} from 'react-map-gl';
import _Get from 'lodash.get';
import { Table } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DeckGL, {IconLayer, TextLayer, GeoJsonLayer} from 'deck.gl';
import {json as requestJson} from 'd3-request';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import {fromJS} from 'immutable';
import stationMarker from './pin-s+377EB8.png';
import inactiveStationMarker from './pin-s+DCDCDC.png';

class GLMap extends Component {
    constructor(props) {
      super(props);
      this.state = {
        x: null,
        y: null,
        isLoading: true,
        hoveredObject: null,
        data: [props.data],  // Buoy data
        station: null,
      };
      this._child = React.createRef();
      // TODO this is obviously a hack, get the streaming stations from the stream
      this._streamingStations = ['Orono.WX2.Airmar'];

    }

    async componentDidMount() {

      // TODO: this.props.isAuthenticated is always undefined
      // data fetch should be performed here not in constructor

      // if (!this.props.isAuthenticated) {
      //   return;
      // }
      try {
        // Test API?
      } catch (e) {
        alert(e);
      }
      this.setState({ isLoading: false });
    }

    componentWillUnmount(){
    }

    _renderTooltip() {
      const {x, y, hoveredObject} = this.state;
      if (!hoveredObject) {
          return null;
      }

      if ('geometry' in hoveredObject) {
        const site = hoveredObject.properties.metadata.id;
        const params = Object.keys(hoveredObject.properties.data);
        const times = hoveredObject.properties.data[params[0]].times;
        const lastUpdate = times[times.length - 1];
        return (
          <div className="marker-tooltip" style={{left: x, top: y}}>
            <div><b>TEST</b></div>
            <div>Last Updated at {lastUpdate}</div>
          </div>
        );
      }
      const name = hoveredObject.longName;
      const params = hoveredObject.obsLongName;
      const values = hoveredObject.obsValues;
      const lastUpdate = hoveredObject.updateTime;
      const owner = hoveredObject.buoyOwners;
      return (
        <div className="marker-tooltip" style={{left: x, top: y}}>
          <div><b>{`${name}`}</b></div>
          <div>{`${owner}`}</div>
          <div>Last Updated at {lastUpdate}</div>
        </div>
      );
    }

    renderMap() {
      const {data} = this.state;
      if (!data)  {
        return null;
      }

      // Set the Viewport
      let latitude = data[0].lat;
      let longitude = data[0].lon;
      let zoom = 6;

      // Viewport settings
      const viewstate = {
        longitude: longitude,
        latitude: latitude,
        zoom: zoom,
        pitch: 0,
        bearing: 0
      };
      const ICON_MAPPING = {
        marker: {x: 0, y: 0, width: 20, height: 50, mask: true}
      };

      const buoyLayer = new IconLayer({
        id: 'icon-layer',
        data: data,
        pickable: true,
        iconAtlas: 'https://a.tiles.mapbox.com/v3/marker/pin-s+BB9427.png',
        // iconAtlas: '/icon-atlas.png',
        iconMapping: ICON_MAPPING,
        // sizeScale: 15,
        sizeScale: 5,
        opacity: 1,
        getIcon: d => 'marker',
        getPosition: d => [d.lon, d.lat],
        getSize: d => 15,
        getColor: d => {
          if ('station' in this.props && d.id === this.props.station) {
            return [184, 75, 3];
          }
          if (this._streamingStations.indexOf(d.id) === -1) {
            return [220, 220, 220];
          }
          return [55, 126, 184];
        },
        onHover: station => this.setState({
          hoveredObject: station.object,
          x: station.x,
          y: station.y
        }),
        onClick: station => {
          if (this._streamingStations.indexOf(station.object.id) === -1) {
            return null;
          }
          const {stream} = this.state;
          // Redirect to station dashboard page
          let route = '/' + station.object.id;
          this.props.history.push({
            pathname: route,
            state: {data: data},
          })
        }
      });

      const buoyLabelLayer = new TextLayer({
        id: 'text-layer',
        data: data,
        pickable: true,
        opacity: 1,
        getPosition: d => [d.lon, d.lat],
        getText: d => {
          return d.id
        },
        getSize: 20,
        getAngle: 0,
        getTextAnchor: 'start',
        getAlignmentBaseline: 'center',
        fontFamily: 'Arial',
      });

      const mapStyle = {
        "version": 8,
        "name": "Stamen Terrain",
        "sources": {
          "stamen-terrain-raster": {
            "type": "raster",
            "tiles": [
              'http://a.tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
              'http://b.tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
              'http://c.tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
            ],
            "tileSize": 256
          }
        },
        "layers": [
          {
            "id": "stamen-terrain",
            "source": "stamen-terrain-raster",
            "type": "raster",
            'layout': {
              'visibility': 'visible'
            },
          },
        ]
      };

      const COLOR_RANGE = [
        [1, 152, 189],
        [73, 227, 206],
        [216, 254, 181],
        [254, 237, 177],
        [254, 173, 84],
        [209, 55, 78]
      ];

      const LIGHT_SETTINGS = {
        lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
        ambientRatio: 0.4,
        diffuseRatio: 0.6,
        specularRatio: 0.2,
        lightsStrength: [0.8, 0.0, 0.8, 0.0],
        numberOfLights: 2
      };

      let token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

      let layers = [buoyLayer, buoyLabelLayer];
            // {this._renderTooltip()}
      return (
        <div className="map-container">
          <div className="map">
            <DeckGL initialViewState={viewstate} controller={true} layers={layers}>
              <InteractiveMap ref={this._child} mapStyle={mapStyle} mapboxApiAccessToken={token}/>
            </DeckGL>
          </div>
        </div>
      );
    }

    render() {
      return this.renderMap();
    }
}

export default withRouter(GLMap);
