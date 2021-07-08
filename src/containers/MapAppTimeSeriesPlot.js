import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import '../index.css';

const colors = ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"];

function MapAppTimeSeriesPlot(props) {
    const [series, setSeries] = useState({})
    const [formattedSeries, setFormattedSeries] = useState([])
    const [yAxis, setYAxis] = useState([])

    // useEffect(() => {
    //     console.log(formattedSeries)
    // }, [formattedSeries])

    useEffect(() => {
        // remove series that are no longer enabled
        Object.keys(series).forEach(serie => {
            if (!props.parameters.includes(serie)) {
                let updatedSeries = { ...series };
                delete updatedSeries[serie]
                setSeries(updatedSeries)
                let indexToRemove = formattedSeries.findIndex(e => e.name === props.parameterMapping[serie])
                setFormattedSeries(formattedSeries.splice(indexToRemove, 1));
            }
        })
        if (props.parameters) {
            setYAxis(buildYAxis())
        }
        // updateSeries()
    }, [props.parameters])

    useEffect(() => {
        updateSeries()
    }, [props.stream])


    const updateSeries = () => {
        let newSeries = {}
        props.parameters.forEach((param, idx) => {
            let seriesData = [];
            let zones = [];
            for (var i = props.stream.length - 1; i >= 0; i--) {
                seriesData.push({
                    x: props.stream[i]["timestamp"] * 1000,
                    y: props.stream[i][param],
                });
            }

            newSeries[param] = {
                name: props.parameterMapping[param],
                dataSorting: {
                    enabled: true
                },
                data: seriesData,
                yAxis: idx,
                color: colors[idx],
                zones: zones                
            }
        })
        setSeries(newSeries)
    }

    useEffect(() => {
        let formatted = [] 
        Object.keys(series).forEach(s => { formatted.push(series[s]) })
        setFormattedSeries(formatted)
    }, [series, yAxis])

    const buildYAxis = () => {
        return props.parameters.map((param, idx) => {
            return {
                title: {
                    text: props.parameterMapping[param],
                    style: {
                        color: colors[idx]
                    }
                },
                labels: {
                    style: {
                        color: colors[idx]
                    }
                },
                opposite: idx % 2 !== 0
            }
        })
    }

    const options = {
        chart: {
          type: 'spline',
          height: 250,
        },
        time: {
          useUTC: false
        },
        xAxis: {
          type: 'datetime'
        },
        title: "",
        yAxis: yAxis,
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        series: formattedSeries,
        tooltip: {
            shared: true
        }
      };


    return (
        <div className="map-app-dashboard">
          <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
        </div>
    );
}


// class MapAppTimeSeriesPlot extends React.Component {
//   render () {
//     let self = this;
//     let stream = this.props.stream;
//     let parameters = this.props.parameters;
//     let color = this.props.color;
//     let subtitle = this.props.subtitle;
//     let series = [];
//     let prettyName = this.props.parameterMapping[parameters[0]];
//     let units = prettyName.indexOf('(') > -1 ? '(' + prettyName.split('(')[1] : '';
//     let timestamp = 'timestamp';

//     parameters.map((param, idx) => {
//       let seriesData = [];
//       let zones = [];
//       for (var i = stream.length - 1; i >= 0; i--) {
//         seriesData.push({
//           x: stream[i][timestamp] * 1000,
//           y: stream[i][param],
//         });
//       }
//       if (prettyName === 'Turbidity (ntu)') {
//         zones = [
//           {
//             value: 8,
//             color: '#008000'
//           },
//           {
//             value: 10,
//             color: '#ffbf00'
//           },
//           {
//             color: '#ff0033'
//           }
//         ]
//       }
//       return series.push({
//         name: self.props.parameterMapping[param],
//         data: seriesData,
//         color: color,
//         zones: zones
//       });
//     });
//     const options = {
//       chart: {
//         type: 'spline',
//         height: 250,
//       },
//       time: {
//         useUTC: false
//       },
//       xAxis: {
//         type: 'datetime'
//       },
//       yAxis: {
//         title: {text: units}
//       },
//       title: {
//         text: prettyName
//       },
//       subtitle: {
//         text: subtitle
//       },
//       legend: {
//         enabled: false
//       },
//       credits: {
//         enabled: false
//       },
//       series: series
//     };
//     return (
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//       />
//     )
//   }
// }
export {MapAppTimeSeriesPlot}
