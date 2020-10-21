import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import '../index.css';

class TimeSeriesPlot extends React.Component {
  render () {
    let self = this;
    let stream = this.props.stream;
    let parameters = this.props.parameters;
    let color = this.props.color;
    let subtitle = this.props.subtitle;
    let series = [];
    let prettyName = this.props.parameterMapping[parameters[0]];
    let units = prettyName.indexOf('(') > -1 ? '(' + prettyName.split('(')[1] : '';
    let timestamp = 'timestamp';

    parameters.map((param, idx) => {
      let seriesData = [];
      let zones = [];
      for (var i = stream.length - 1; i >= 0; i--) {
        seriesData.push({
          x: stream[i][timestamp] * 1000,
          y: stream[i][param],
        });
      }
      if (prettyName === 'Turbidity (ntu)') {
        zones = [
          {
            value: 8,
            color: '#008000'
          },
          {
            value: 10,
            color: '#ffbf00'
          },
          {
            color: '#ff0033'
          }
        ]
      }
      return series.push({
        name: self.props.parameterMapping[param],
        data: seriesData,
        color: color,
        zones: zones
      });
    });
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
      yAxis: {
        title: {text: units}
      },
      title: {
        text: prettyName
      },
      subtitle: {
        text: subtitle
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: series
    };
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    )
  }
}
export {TimeSeriesPlot}
