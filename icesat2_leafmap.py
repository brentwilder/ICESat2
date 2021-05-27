# Mapping collections over a transect in Madagascar using leafmap
# B.A. Wilder
# 05/27/21

# Import libraries
import os
import glob
import pandas as pd
import leafmap

# Concat ICESat csv files from data folder into one dataframe
path = r'./data'                     
all_files = glob.glob(os.path.join(path, "*.csv"))
df_from_each_file = (pd.read_csv(f) for f in all_files)
df = pd.concat(df_from_each_file, ignore_index=True)
df = df.dropna()
#df.to_csv('./data/elev_all.csv') # create new df from combined data

# Create map object and plot xy data
in_csv = './data/elev_all.csv'
Map = leafmap.Map()
Map.add_xy_data(in_csv, x="longitude", y="latitude", layer_name="World Cities")
Map