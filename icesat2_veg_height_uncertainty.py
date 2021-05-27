# Calculating uncertainty for ICESat-2 vegetation height data over a transect in Madagascar 
# B.A. Wilder
# 05/27/21

# Import libraries
import os
import glob
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import ttest_ind
plt.rcParams.update({'font.size': 12})

# Concat ICESat csv files from data folder into one dataframe
path = r'./data'                     
all_files = glob.glob(os.path.join(path, "*.csv"))
df_from_each_file = (pd.read_csv(f) for f in all_files)
df = pd.concat(df_from_each_file, ignore_index=True)

# For this code, outlier were kept in to look at the data as a whole
# as noted in the visualization script, there is a lot of canopy heights
# that exceed reality for a tree height in Madagascar
df = df.dropna() # drop NaN
df = df.rename(columns={"file_name":"date"}) # rename date column
df = df.rename(columns={"h_canopy_uncertainty":"canopy uncertainty (m)"}) # rename uncertainty column
df['date'] = df['date'].str.slice(16,24) # shorten date string

# print first 5 lines of df and print stats
print(df.head())
print(df.describe())

# plot data
df.boxplot(by='date',column='canopy uncertainty (m)')
df.boxplot(by='beam',column='canopy uncertainty (m)')
plt.show()


# calculate significance of gt2l beam (2 sample t-test)
cat1 = df[df['beam']=='gt2l'] # with
cat2 = df[df['beam']!='gt2l'] # without
t_test = ttest_ind(cat1['canopy uncertainty (m)'], cat2['canopy uncertainty (m)'])
print(t_test)