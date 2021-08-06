import React, { useState, useEffect } from 'react';
import { MapAppTimeSeriesPlot } from './MapAppTimeSeriesPlot';
import { TimeSeriesPlot } from './../components/TimeSeriesPlot';
import { Row, Col, Checkbox, Button } from 'antd';
import moment from 'moment';

import './MapApp.scss';

const paramMapping = {
    baro_press: "Barometric Pressure (mmHg)",
    airtemp: "Air Temperature (°F)",
    wind_direction: "Wind Direction (°)",
    wind_speed: "Wind Speed (kts)"
}

function MapAppDashboard(props) {
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dataStream, setDataStream] = useState([]);
    const [enabledPlotParameters, setEnabledPlotParameters] = useState(["baro_press"])

    // useEffect(() => {
    //     console.log(dataStream)
    // }, [dataStream])

    useEffect(() => {
        handleConnect()
    }, [])

    const sortByKey = (array, key) => {
        let b = array.sort(function (a, b) {
            let x = a[key];
            let y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });

        console.log(b)
        return b
    }

    const addToDataStream = (stream) => {
        let newStream = [...dataStream];
        setDataStream(dataStream => sortByKey([
            stream,
            ...dataStream,
        ], 'timestamp'))
    }

    const onCheck = (param) => {
        if (enabledPlotParameters.includes(param)) {
            setEnabledPlotParameters(enabledPlotParameters.filter(e => e !== param));
        } else {
            setEnabledPlotParameters([
                ...enabledPlotParameters,
                param
            ])
        }
    }

    const handleConnect = () => {
        try {
            const url = 'wss://9f50kdhxci.execute-api.us-east-1.amazonaws.com/DEV';
            let connection = new WebSocket(url);

            connection.onerror = e => {
                console.error('Stream Connection Error');
            }

            connection.onopen = e => {
                const message = JSON.stringify({ action: 'history' });
                connection.send(message);
                setIsConnected(true);
                setIsLoading(false);
            }

            connection.onmessage = e => {
                let jsonStreams = JSON.parse(e.data);
                if (!Array.isArray(jsonStreams)) {
                    return;
                }

                const thisStation = props.sensorStation.id;
                let filteredStream = jsonStreams.filter(function (item) {
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
                let transformedStream = {
                    timestamp: moment(timestamp).valueOf() / 1000.,  // s since epoch
                    baro_press: parseFloat(message[1]),  // mmHg
                    airtemp: message[5] && (parseFloat(message[5]) * 9 / 5) + 32,  // degF
                    wind_direction: parseFloat(message[13]),  // True
                    wind_speed: parseFloat(message[17]),  //knots
                    id: filteredStream[0].datatype,
                    lat: 44 + 53.7084 / 60,
                    lon: -(68 + 39.9878 / 60)
                };
                addToDataStream(transformedStream)
            }
        } catch (e) {
            console.error('error while loading')
            setIsLoading(false)
        }

    }

    const resetDataStream = () => {
        setDataStream([dataStream[0]]);
    }



    return (
        <div className="map-app-dashboard">
            <Row>
                <Col span={4}>
                    <Button className="reset-stream mb-2" onClick={resetDataStream}>
                        Reset data stream
                    </Button>
                    {Object.keys(paramMapping).map(param => {
                        return <Checkbox key={param} checked={enabledPlotParameters.includes(param)} onChange={() => onCheck(param)} style={{ fontSize: ".8rem" }}>{paramMapping[param]}</Checkbox>
                    })}
                </Col>
                <Col span={20}>

                {isLoading &&
                <div style={{
                    width: "100%",
                    textAlign: "center"
                }}><h1 style={{fontWeight: 400}}>Loading...</h1></div>
            }

                    {dataStream && !isLoading && isConnected && !props.extended &&
                        <MapAppTimeSeriesPlot key={"test"} stream={dataStream} parameters={enabledPlotParameters} parameterMapping={paramMapping} />
                    }

                    {dataStream && !isLoading && isConnected && props.extended &&
                        enabledPlotParameters.map((param, index) => {
                            return <MapAppTimeSeriesPlot key={param} stream={dataStream} parameters={[param]} parameterMapping={paramMapping} index={index} />
                        })}
                </Col>
            </Row>
        </div>
    );
}


export default MapAppDashboard;
