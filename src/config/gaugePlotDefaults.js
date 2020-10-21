export default {
  'Wind Speed (kts)': {
    dangerThreshold: 15,
    warningThreshold: 10,
    yAxis: {
      min: 0,
      max: 20,

      minorTickInterval: 'auto',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: 'inside',
      minorTickColor: '#336E7B',

      tickPixelInterval: 30,
      tickWidth: 2,
      tickPosition: 'inside',
      tickLength: 15,
      tickColor: '#666',
      labels: {
        step: 2,
        rotation: 'auto'
      },
      title: {
        text: ''
      },
      plotBands: [
        {
          from: 0,
          to: 10,
          thickness: 15,
          color: '#54C6DF' // blue
        },
        {
          from: 10,
          to: 15,
          thickness: 15,
          color: '#A3E3C3' // light green
        },
        {
          from: 15,
          to: 20,
          thickness: 15,
          color: '#049372' // dark green
        }
      ]
    }
  },
  'Barometric Pressure (mmHg)': {
    dangerThreshold: 40,
    warningThreshold: 30,
    yAxis: {
      min: 0,
      max: 50,

      minorTickInterval: 'auto',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: 'inside',
      minorTickColor: '#336E7B',

      tickPixelInterval: 30,
      tickWidth: 2,
      tickPosition: 'inside',
      tickLength: 15,
      tickColor: '#666',
      labels: {
        step: 2,
        rotation: 'auto'
      },
      title: {
        text: ''
      },
      plotBands: [
        {
          from: 0,
          to: 30,
          thickness: 15,
          color: '#54C6DF' // blue
        },
        {
          from: 30,
          to: 40,
          thickness: 15,
          color: '#A3E3C3' // light green
        },
        {
          from: 40,
          to: 50,
          thickness: 15,
          color: '#049372' // dark green
        }
      ]
    }
  }
};
