# ICESat-2 Canopy Height (05/21/21)

## Objectives
- Visualize canopy height across a transect in Madagascar
- Plot data both in 2D and 3D

## Study Area
- [Eastern Madagascar](https://www.worldwildlife.org/ecoregions/at0117)
![leafmap](https://github.com/bwilder95/ICESat2/blob/main/plots/Madagascar.html)

## Data
- Data was collected from https://openaltimetry.org/data/icesat2/
![Madagascar](https://github.com/bwilder95/ICESat2/blob/main/plots/Madagascar.png)
- Data was compiled from 9 different passovers: 2018-11-29, 2019-02-28, 2019-05-30, 2019-08-26, 2019-11-27, 2020-05-27, 2020-08-26, 2020-11-24, and 2021-02-23
- Much of the data recorded outlier canopy height greater than 35-meters. For this simple exercise the outlier data were converted to median canopy height (15.5-meters).
- Data included NaN or None data were dropped from the visualization
- Final tally of ICESat-2 points mapped after cleaning = 8,520 measurements

## Results
- 2D representation of latitude and canopy height
![Canopy2D](https://github.com/bwilder95/ICESat2/blob/main/plots/Canopy_2D.png)

- 3D representation of latitude, longitude, canopy height
![Canopy3D](https://github.com/bwilder95/ICESat2/blob/main/plots/Canopy_3D.png)


# ICESat-2 DEM Comparison (05/21/21)

## Objectives
- Compare elevations across a transect in Madagascar to 30-m DEM
- Plot results and list statistics using Google Earth Engine
![GEE](https://github.com/bwilder95/ICESat2/blob/main/plots/GEE.png)

## Data
- Same as above, but this time only used measurements from 2020-05-27
- Total of 3,737 ICESat points
- Used 30-meter DEM from Google Earth Engine's NASA SRTM Digital Elevation 30m image

## Results
- Across the transect we can see what seems to be a consistent positive bias from SRTM
![ELEV](https://github.com/bwilder95/ICESat2/blob/main/plots/ICESat_DEM_Lat.png)

- Performance metrics were good with R^2=0.99 and RMSE=0.19-m. Positive bias was quite high, which matches what others have found for [forested areas](https://www.usgs.gov/core-science-systems/eros/topochange/science/accuracy-assessment-elevation-data?qt-science_center_objects=0#qt-science_center_objects).
![Performance](https://github.com/bwilder95/ICESat2/blob/main/plots/ICESat_DEM_perform.png)

# ICESat-2 Canopy Height Uncertainty (05/27/21)

## Objectives
- Calculate canopy uncertainty statistics for different images (and different [beams](https://icesat-2.gsfc.nasa.gov/science/specs))

## Data
- Same as above (for all dates)

## Results
- Overall statistics for canopy uncertainty 
    * count = 8,560
    * median = 3.3-meters
    * mean = 6.0-meters
    * standard deviation = 8.25-meters

- Uncertainty varied by image collection date, with median uncertainty ranging from 0.5 to 5.7-meters
![day](https://github.com/bwilder95/ICESat2/blob/main/plots/Canopy_uncert_day.png)

- Uncertainty also varied by beam, with **gt2l** having statistically higher uncertainty than other beams (p < 0.05)
    * pvalue = 2.1732473356675775e-15
    * tstatistic = 7.9458647215372435
    * **median for gt2l = 5.1-meters**
    * median for all other beams = 3.1-meters
![beam](https://github.com/bwilder95/ICESat2/blob/main/plots/Canopy_uncert_beam.png)