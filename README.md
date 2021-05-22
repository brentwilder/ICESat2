# ICESat-2 Canopy Height

## Objectives
- Visualize canopy height across a transect in Madagascar
- Plot data both in 2D and 3D

## Study Area
- [Eastern Madagascar](https://www.worldwildlife.org/ecoregions/at0117)
![Madagascar](https://github.com/bwilder95/ICESat2/blob/main/plots/Madagascar.png)

## Data
- Data was collected from https://openaltimetry.org/data/icesat2/
- Data was compiled from 9 different passovers: 2018-11-29, 2019-02-28, 2019-05-30, 2019-08-26, 2019-11-27, 2020-05-27, 2020-08-26, 2020-11-24, and 2021-02-23
- Much of the data recorded outlier canopy height greater than 35-meters. For this simple exercise the outlier data were converted to median canopy height (15.5-meters).
- Data included NaN or None data were dropped from the visualization
- Final tally of ICESat-2 points mapped after cleaning = 8,520 measurements

## Results
- 2D representation of latitude and canopy height
![Canopy2D](https://github.com/bwilder95/ICESat2/blob/main/plots/Canopy_2D.png)

- 3D representation of latitude, longitude, canopy height
![Canopy3D](https://github.com/bwilder95/ICESat2/blob/main/plots/Canopy_3D.png)


# ICESat-2 DEM Comparison

## Objectives
- Compare elevations across a transect in Madagascar to 90-m DEM
- Plot results and list statistics 

## Data
- Same as above, but this time only used measurements from 2020-05-27
- Total of 3,737 ICESat points
- Used 90-meter DEM from SRTM V4, Google Earth Engine

## Results
- Across the transect we can see what seems to be a consistent positive bias from SRTM
![ELEV](https://github.com/bwilder95/ICESat2/blob/main/plots/ICESat_DEM_Lat.png)

- Performance metrics were good with R^2=0.99 and RMSE=0.47-meters. Positive bias was quite high.
![Performance](https://github.com/bwilder95/ICESat2/blob/main/plots/ICESat_DEM_perform.png)
