import gaugePlotDefaults from '../config/gaugePlotDefaults';
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts-more';
HighchartsMore(Highcharts);


class GaugePlot extends React.Component {
  render () {
    let prettyName = this.props.parameter;
    let dataPoint = this.props.dataPoint;
    let value = dataPoint === 'bdl' ? 0 : parseFloat(parseFloat(dataPoint).toFixed(2));
    let backgroundColor = '#54C6DF';
    let yaxis = gaugePlotDefaults[prettyName].yAxis;
    let dangerThreshold = gaugePlotDefaults[prettyName].dangerThreshold;
    let warningThreshold = gaugePlotDefaults[prettyName].warningThreshold;
    let maxThreshold = gaugePlotDefaults[prettyName].yAxis.max;

    if (value > maxThreshold) {
      value = maxThreshold;
    }
    if (value > dangerThreshold) {
      backgroundColor = '#049372';
    } else if (value > warningThreshold) {
      backgroundColor = '#A3E3C3';
    }
    const options = {
      yAxis: yaxis,
      chart: {
        height: 250,
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
      },
      plotOptions: {
        gauge: {
          dial: {
            radius: '60%',
            backgroundColor: '#034554',
            baseWidth: 3,
            topWidth: 1,
            baseLength: '90%', // of radius
            rearLength: '0%'
          },
          pivot: {
            backgroundColor: '#034554',
            borderColor:"#000",
            radius: 4
          }
        }
      },
      credits: {
        enabled: false
      },
      title: {
        text: prettyName
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        background: []
      },
      series: [{
        name: prettyName,
        data: [value || 0],
        tooltip: {
          valuePrefix: value >= maxThreshold ? '>' : ''
        },
        dataLabels: {
          backgroundColor: null,  // backgroundColor
          formatter: function() {
            if (dataPoint !== 'bdl' && (dataPoint === null || (Number.isNaN(Number(dataPoint))))) return 'No Data';
            if (dataPoint === 'bdl') return 'bdl';

            return value >= maxThreshold ? parseFloat(dataPoint).toFixed(2) :
                parseFloat(dataPoint).toFixed(2);
          }
        }
      }]
    }
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    )
  }
}
export default GaugePlot
