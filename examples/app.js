'use strict';

import React, { Component } from 'react';

import AreaChartExample from './components/example-areachart.jsx';
import BarChartExample from './components/example-barchart';
import ChoroplethExample from './components/example-choropleth';
import LegendExample from './components/example-legend.jsx';
import PunchcardExample from './components/example-punchcard.jsx';
import LeafletChoropleth from './components/example-leafletChoropleth.jsx';

class App extends Component {
  static displayName = 'App';

  render() {
    return (
      <div>
        <h1>Panorama Toolkit examples</h1>
        <hr />
        <h2>Area Chart</h2>
        <AreaChartExample/>
        <h2>Bar Chart</h2>
        <BarChartExample/>
        <h2>Choropleth</h2>
        <ChoroplethExample/>
        <h2>Legend</h2>
        <LegendExample/>
        <h2>Punchcard</h2>
        <PunchcardExample/>
        <h2>Leaflet Choropleth</h2>
        <LeafletChoropleth />
      </div>
    );
  }
}

export default App;