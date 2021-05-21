# Visualizing compiled ICESat-2 vegetation height data over a transect in Madagascar 
# B.A. Wilder
# 05/21/21

# Import libraries
import os
import glob
import pandas as pd
import numpy as np
from mpl_toolkits.mplot3d import axes3d
import matplotlib.pyplot as plt
from scipy.stats import gaussian_kde

# Concat ICESat csv files from data folder into one dataframe
path = r'./data'                     
all_files = glob.glob(os.path.join(path, "*.csv"))
df_from_each_file = (pd.read_csv(f) for f in all_files)
df = pd.concat(df_from_each_file, ignore_index=True)

# Based on this boxplot, we can see anything above 38.47m, or 126.2ft, is an outlier 
# If this was an actual study, I would need to figure out what to do with this, bc 
# there is quite a bit of data that is considered an outlier
# however, for this visualization I will convert to the median of the dataset.

# set condition to clean visual
canopy_limit = 35 # meters
canopy_median = 15.539093 # meters
df['h_canopy'] = np.where((df.h_canopy > canopy_limit),canopy_median,df.h_canopy)
df = df.dropna()
#boxplot = df.boxplot(column=['h_canopy'])

# Plot 3-D plot to represent the trees
x = df.longitude
y = df.latitude
z = np.zeros(df.h_canopy.size)
dx = 0.005 * np.ones(df.longitude.size)
dy = 0.03 * np.ones(df.latitude.size)
dz = df.h_canopy

fig = plt.figure(figsize = (10, 20))
ax = plt.axes(projection ="3d")
ax.grid(b = True, color ='grey',
        linestyle ='-.', linewidth = 0.3,
        alpha = 0.2)
bar = ax.bar3d(x, y,z,dx,dy,dz, color='green')
ax.set_xlabel('longitude', fontweight ='bold')
ax.set_ylabel('latitude', fontweight ='bold')
ax.set_zlabel('canopy height (m)', fontweight ='bold')
ax.set_zlim(0,40)
ax.view_init(23,-33)

###############################################################################
###############################################################################
###############################################################################

# Plot 2-D profile with respect to latitude with point density for 
# Calculate the point density
x = df['latitude'].to_numpy()
y = df['h_canopy'].to_numpy()
xy = np.vstack([x,y])
z = gaussian_kde(xy)(xy)

# Sort the points by density, so that the densest points are plotted last
idx = z.argsort()
x, y, z = x[idx], y[idx], z[idx]

fig, ax = plt.subplots()
density = ax.scatter(x, y, c=z, s=50)
fig.colorbar(density, label='Density of points')
ax.set_xlabel('latitude')
ax.set_ylabel('canopy height (m)')
plt.show()
