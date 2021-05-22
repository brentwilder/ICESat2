// Comparing ICESat-2 elevation data to DEM over a transect in Madagascar for May 25, 2020
// B.A. Wilder
// 05/21/21

// load DEM and display ICESat2 transect
var pts = ee.FeatureCollection('users/bwilder95/elev_2020-05-27')
Map.addLayer(pts);
var DEM = ee.Image('CGIAR/SRTM90_V4')
                  .select('elevation');
// Calculate slope from the DEM.
var slope = ee.Terrain.slope(DEM);


// function to create buffer around points
function bufferPoints(radius, bounds) {
  return function(pt) {
    pt = ee.Feature(pt);
    return bounds ? pt.buffer(radius).bounds() : pt.buffer(radius);
  };
}

function zonalStats(ic, fc, params) {
  // Initialize internal params dictionary.
  var _params = {
    reducer: ee.Reducer.mean(),
    scale: null,
    crs: null,
    bands: null,
    bandsRename: null,
    imgProps: null,
    imgPropsRename: null,
    datetimeName: 'datetime',
    datetimeFormat: 'YYYY-MM-dd HH:MM:ss'
  };

  // Replace initialized params with provided params.
  if (params) {
    for (var param in params) {
      _params[param] = params[param] || _params[param];
    }
  }

  // Set default parameters based on an image representative.
  var imgRep = ic.first();
  var nonSystemImgProps = ee.Feature(null)
    .copyProperties(imgRep).propertyNames();
  if (!_params.bands) _params.bands = imgRep.bandNames();
  if (!_params.bandsRename) _params.bandsRename = _params.bands;
  if (!_params.imgProps) _params.imgProps = nonSystemImgProps;
  if (!_params.imgPropsRename) _params.imgPropsRename = _params.imgProps;

  // Map the reduceRegions function over the image collection.
  var results = ic.map(function(img) {
    // Select bands (optionally rename), set a datetime & timestamp property.
    img = ee.Image(img.select(_params.bands, _params.bandsRename))
      .set(_params.datetimeName, img.date().format(_params.datetimeFormat))
      .set('timestamp', img.get('system:time_start'));

    // Define final image property dictionary to set in output features.
    var propsFrom = ee.List(_params.imgProps)
      .cat(ee.List([_params.datetimeName, 'timestamp']));
    var propsTo = ee.List(_params.imgPropsRename)
      .cat(ee.List([_params.datetimeName, 'timestamp']));
    var imgProps = img.toDictionary(propsFrom).rename(propsFrom, propsTo);

    // Subset points that intersect the given image.
    var fcSub = fc.filterBounds(img.geometry());

    // Reduce the image by regions.
    return img.reduceRegions({
      collection: fcSub,
      reducer: _params.reducer,
      scale: _params.scale,
      crs: _params.crs
    })
    // Add metadata to each feature.
    .map(function(f) {
      return f.set(imgProps);
    });
  }).flatten().filter(ee.Filter.notNull(_params.bandsRename));

  return results;
}

// apply buffer to points
var ptsTopo = pts.map(bufferPoints(10, false));

// Define parameters for the zonalStats function.
var params = {
  bands: [0,1],
  bandsRename: ['elevation','slope']
};

// Concatenate elevation and slope as two bands of an image.
var topo = ee.Image.cat(DEM, slope)
  // Computed images do not have a 'system:time_start' property; add one based
  // on when the data were collected.
  .set('system:time_start', ee.Date('2000-01-01').millis());

// Wrap the single image in an ImageCollection for use in the zonalStats function.
var topoCol = ee.ImageCollection([topo]);

// Extract zonal statistics per point per image.
var df = zonalStats(topoCol, ptsTopo, params);
print(df);
/////////////////////////////////////////////////////////////////////////////////
// Plot results /////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

// Define the chart and print it to the console.
var chart =
    ui.Chart.feature
        .byFeature({
          features: df,
          xProperty: 'elevation',
          yProperties: ['h_te_best_fit']
        })
        .setSeriesNames(['Elevation'])
        .setChartType('ScatterChart')
        .setOptions({
          title: 'ICESat2 vs. 30-m DEM',
          hAxis:
              {title: '30-m DEM', titleTextStyle: {italic: false, bold: true}},
          vAxis: {
            title: 'ICESat2',
            titleTextStyle: {italic: false, bold: true}
          },
          pointSize: 10,
          colors: ['1d6b99', 'cf513e'],
        });
print(chart);

var chart2 =
    ui.Chart.feature
        .byFeature({
          features: df,
          xProperty: 'latitude',
          yProperties: ['h_te_best_fit','elevation']
        })
        .setSeriesNames(['ICESat2','DEM'])
        .setChartType('ScatterChart')
        .setOptions({
          title: 'ICESat2 vs. 30-m DEM',
          hAxis:
              {title: 'latitude', titleTextStyle: {italic: false, bold: true}},
          vAxis: {
            title: 'Elevation (m)',
            titleTextStyle: {italic: false, bold: true}
          },
          pointSize: 10,
          colors: ['1d6b99', 'cf513e'],
        });
print(chart2);