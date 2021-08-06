import React, { useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { PieChartOutlined, ExpandAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import { Layout, Menu, Drawer, Button, Checkbox } from 'antd';
import MapAppDashboard from '../containers/MapAppDashboard';
import './MapApp.scss';

const { Header, Content, Sider } = Layout;

const sensorStations = [
    {
        id: 'Orono.WX2.Airmar',
        lat: 44.89514,
        lon: -68.66646333333334,
        name: 'Orono.WX2.Airmar',
    }
]


function MapApp() {
    const [collapsed, setCollapsed] = useState(true);
    const [sensorStationMarkerOnHover, setSensorStationMarkerOnHover] = useState(undefined);
    const [selectedSensorStation, setSelectedSensorStation] = useState(undefined);
    const [bottomDrawerExpanded, setBottomDrawerExpanded] = useState(false);
    const [viewport, setViewport] = useState({
        width: 400,
        height: 400,
        latitude: 44,
        longitude: -70.66646333333334,
        zoom: 6
    });
    const [showStationDrawer, setShowStationDrawer] = useState(false);


    const onCollapse = () => {
        console.log(collapsed);
        setCollapsed(!collapsed);
    };

    const onMarkerClick = (sensorStation) => {
        if (selectedSensorStation === sensorStation) {
            setSelectedSensorStation(undefined);
        } else {
            setSelectedSensorStation(sensorStation)
        }
    }

    const stationOnCheck = (sensorStation) => {
        if (selectedSensorStation === sensorStation) {
            setSelectedSensorStation(undefined);
        } else {
            setSelectedSensorStation(sensorStation)
        }

        setShowStationDrawer(false);
    }

    const onMarkerMouseEnter = (sensorStation) => {
        setSensorStationMarkerOnHover(sensorStation)
    }

    const onMarkerMouseLeave = () => {
        setSensorStationMarkerOnHover(undefined);
    }

    const stationsMenuOnClick = () => {
        setShowStationDrawer(!showStationDrawer)
    }

    const PulsingMarker = (props) => {
        return (
            <>
                <Marker
                    latitude={Number(props.lat)}
                    longitude={Number(props.lon)}
                    offsetLeft={-13}
                    offsetTop={-12}
                >

                    {/* 
                        update to this marker at some point?
                        https://docs.mapbox.com/mapbox-gl-js/example/add-image-animated/
                    */}

                    <div className="pulsing-marker"
                        style={{
                            width: "1.5rem",
                            height: "1.5rem",
                            cursor: "pointer"
                        }}>
                        <div className="spinner-grow" style={{
                            width: "100%",
                            height: "100%",
                            color: "#ffffff9e"
                        }} role="status">
                        </div>
                        <div className="static-dot" style={{
                            borderRadius: "1em",
                            position: "relative",
                            width: ".25rem",
                            height: ".25rem",
                            backgroundColor: "#eeeeee",
                            margin: "-1rem .65rem"
                        }}></div>
                    </div>

                </Marker>
            </>
        )
    }

    return (
        <>
            <Header className="site-layout-background" style={{ padding: 0 }} >
                <h4 style={{ color: "white", paddingTop: "1rem", textAlign: "left", paddingLeft: '1.5rem' }}>IOOS Sensor Streaming</h4>
            </Header>
            <Layout style={{ minHeight: 'calc(100vh - 64px)' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" style={{ marginTop: "-.25rem" }}>
                        <Menu.Item onClick={stationsMenuOnClick} key="1" icon={<img className="mt-2 pb-1" src="https://a.tiles.mapbox.com/v3/marker/pin-s+ffffff.png"></img>}>
                            Available stations
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Content className="site-drawer-render-in-current-wrapper">
                        <Drawer
                            getContainer={false}
                            title={'Available stations'}
                            placement="left"
                            closable={true}
                            onClose={() => setShowStationDrawer(false)}
                            mask={false}
                            visible={showStationDrawer}
                            key="left"
                            style={{ position: 'absolute' }}
                        >

                            { sensorStations.map((station) => {
                                return (
                                    <a style={{ textAlign: "left", float: "left"}} onClick={() => stationOnCheck(station)}>{station.id}</a>
                                )
                            })}

                        </Drawer>
                        <ReactMapGL
                            {...viewport}
                            onViewportChange={nextViewport => setViewport(nextViewport)}
                            mapboxApiAccessToken={"pk.eyJ1IjoibWF0dC1pYW5udWNjaS1ycHMiLCJhIjoiY2tuYXA5bmlzMGxrMTJvb29tM2E5aHNmdyJ9.MyD4MKS5e4pHy6-_BnYiEQ"}
                            width={'100%'}
                            height={'100%'}
                        >

                            {sensorStations.map(sensorStation => {
                                return <Marker
                                    latitude={sensorStation.lat}
                                    longitude={sensorStation.lon}
                                    captureClick={false}
                                    offsetLeft={-11}
                                    offsetTop={-25}
                                >
                                    <img
                                        className="marker"
                                        style={{ cursor: 'pointer' }}
                                        src={`https://a.tiles.mapbox.com/v3/marker/pin-s+d00000.png`}
                                        onMouseEnter={() => onMarkerMouseEnter(sensorStation)}
                                        onMouseLeave={onMarkerMouseLeave}
                                        onClick={() => onMarkerClick(sensorStation)} />
                                </Marker>
                            })}

                            {
                                sensorStationMarkerOnHover &&
                                <Popup
                                    key={sensorStationMarkerOnHover.id}
                                    offsetTop={-25}
                                    offsetLeft={0}
                                    latitude={sensorStationMarkerOnHover.lat}
                                    longitude={sensorStationMarkerOnHover.lon}
                                // closeOnClick
                                // onClose={() => onPointPopupClose && onPointPopupClose(selectedCollectionItem)}
                                >
                                    <div style={{ padding: '8px' }}>
                                        <h6 style={{ fontWeight: 'bold' }}>{sensorStationMarkerOnHover.name}</h6>
                                        <span className="d-block" style={{ textAlign: "left" }}><b>&nbsp;Latitude: </b> {sensorStationMarkerOnHover.lat.toFixed(4)}</span>
                                        <span style={{ textAlign: "left" }}><b>Longitude: </b> {sensorStationMarkerOnHover.lon.toFixed(4)}</span>

                                    </div>
                                </Popup>
                            }

                            {
                                selectedSensorStation &&
                                <PulsingMarker lat={selectedSensorStation.lat} lon={selectedSensorStation.lon} />
                            }


                        </ReactMapGL>



                        <Drawer
                            title={selectedSensorStation?.name ?? ''}
                            placement="bottom"
                            closable={true}
                            onClose={() => setSelectedSensorStation(undefined)}
                            mask={false}
                            height={bottomDrawerExpanded ? "calc(100% - 64px)" : "40%"}
                            style={{ marginLeft: "5rem", width: "calc(100% - 5rem)", transitionDuration: ".3s" }}
                            visible={selectedSensorStation}

                            key="bottom"
                        >
                            <Button className="expand-drawer-button" onClick={() => setBottomDrawerExpanded(!bottomDrawerExpanded)}>
                                {bottomDrawerExpanded &&
                                    <ShrinkOutlined />
                                }

                                {!bottomDrawerExpanded &&
                                    <ExpandAltOutlined />
                                }
                            </Button>

                            {selectedSensorStation &&
                                <MapAppDashboard sensorStation={selectedSensorStation} extended={bottomDrawerExpanded}></MapAppDashboard>
                            }
                        </Drawer>


                    </Content>
                </Layout>



            </Layout>
        </>
    );
}

export default MapApp;
