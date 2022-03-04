import pandas
from pandas import ExcelWriter
import numpy as np
from scipy.sparse.construct import rand
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from osgeo import gdal
from osgeo import osr
from PIL import Image
import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import sys
import json
import uuid
import base64
import os
import cv2 

basepath = os.path.abspath('tmp')
arg1 = sys.argv[1]
length = int(sys.argv[2])
width = int(sys.argv[3])
longitude = float(sys.argv[4])
latitude = float(sys.argv[5])
field_input_index1 = pandas.read_excel(arg1).to_numpy()
field_input_index_test = pandas.read_excel(arg1).to_numpy()
array_size1 = (np.shape(field_input_index1))[0] #number of rows
#print(range(array_size1)) #uncommment for testing
array_size2 = (np.shape(field_input_index1))[1] #number of columns
#print(range(array_size2)) #uncomment for testing
win_size = 5
field_input_index1_mean = 0
field_input_index1_std = 0
field_input_index1_max = 0
field_input_index1_min = 0
ndvi_range_value = 0
message = ""
global field_input_index_clustered_optimal
plt.rcParams['axes.labelcolor'] = 'white'
plt.rcParams['text.color'] = 'white'
plt.rcParams['axes.labelcolor'] = 'white'
plt.rcParams['xtick.color'] = 'white'
plt.rcParams['ytick.color'] = 'white'
plt.rcParams['axes.facecolor'] = '#1B262C'
#plt.rcParams['spines.set_color'] = 'white'

def outlier_removal2D(field_input_index1, array_size1, array_size2, win_size):
    # To check the input index data if it has some out of possible range value
    for p in range(array_size1):
        for q in range(array_size2):
            #print(field_input_index1[p,q])
            if field_input_index1[p, q] > 1 or field_input_index1[p, q] < -1:
                field_input_index1[p, q] = np.nan              
    ind_nonan = np.where(np.isnan(field_input_index1) == False)   # Indices of input matrix where nan is not present  
    global field_input_index1_mean
    global field_input_index1_max
    global field_input_index1_min
    global field_input_index1_std
    global ndvi_range_value
    global message    
    global Nan_index 
    global Not_Nan_index
    global randomString
    global optimal_zones_val    
    global field_input_index_clustered_optimal
    randomString = str(uuid.uuid4().hex)
    excel_path = os.path.join('./tmp', 'Cluster_info_' + randomString + '.xlsx')
    writer = pandas.ExcelWriter(excel_path, engine = 'xlsxwriter')   
    field_input_index1_mean = np.mean(field_input_index1[ind_nonan]) 
    field_input_index1_max = np.amax(field_input_index1[ind_nonan])
    field_input_index1_min = np.amin(field_input_index1[ind_nonan])
    field_input_index1_std = np.std(field_input_index1[ind_nonan])
    ndvi_range_value = np.amax(field_input_index1[ind_nonan]) - np.amin(field_input_index1[ind_nonan])


    #print("mean: ",field_input_index1_mean)
    #print("max: ",field_input_index1_max)
    #print("min: ",field_input_index1_min)
    #print("std: ",field_input_index1_std)                


    field_input_index1 = np.reshape(field_input_index1, (length,width))
    array_size1 = (np.shape(field_input_index1))[0] #number of rows
    array_size2 = (np.shape(field_input_index1))[1] #number of columns
    
  # To remove the field outliers
    k = 0
    for k in range(array_size1 - 4):
        for n in range(array_size2 - 4):
                #print("test")
                for i in range(win_size):
                    for j in range(win_size):
                        if (np.isnan(field_input_index1[i+k,j+n]) == False):
                            if field_input_index1[i+k,j+n] > (field_input_index1_mean + 3 * field_input_index1_std) or field_input_index1[i+k,j+n] < (field_input_index1_mean - 3 * field_input_index1_std):
                                win_matrix = field_input_index1[k:k+win_size, n:n+win_size]
                                ind_nonan2 = np.where(np.isnan(win_matrix) == False)
                                win_not_nan_matrix = win_matrix[ind_nonan2]
                                field_input_index1[i+k,j+n] =  np.mean(win_not_nan_matrix)
                                #print("test")
                            else:                                                        # not really required
                                field_input_index1[i+k,j+n] = field_input_index1[i+k,j+n]     
    #field_input_index1 = np.reshape(field_input_index1, (-1, 1))#convert back to 1D array (maybe not needed)
    
    outlier_rem_input_array = field_input_index1.reshape(-1,1)
    # Mask NaN pixels
    Nan_index = np.where(np.isnan(outlier_rem_input_array))
    Not_Nan_index = np.where(np.isfinite(outlier_rem_input_array))
    field_input_index2 = (outlier_rem_input_array[Not_Nan_index])
    field_input_index_reshaped_col = field_input_index2.reshape(-1,1) # Reshaped into a column after removing the outliers
    if np.max(field_input_index_reshaped_col) < 0.2:
        message = "Fallow field. Zoning results should be followed cautiously."
    elif np.max(field_input_index_reshaped_col) - np.min(field_input_index_reshaped_col) < 0.2:
        message = "Field is almost uniform. Zoning may not be required."
    else:
        message = "Zoning may be useful"
    #Performance Graph
    n_cluster = 11                  # no. of clusters we want to cluster a field into +1 for further use in loops
    Sigma_total_zone = []
    Zones_no = []
    optimal_zones = []
    n_samples = len(field_input_index_reshaped_col)
    # Criteria/ condition to avoid situations with Sigma_total_zone[0] = 0 coz it probably makes Zone_percent undefined:
    if (n_samples == 1):
        # print('zone percent out of range, coz only 1 pixel sized image')
        optimal_zones.append(1)
        optimal_zones_val = 1
        k_means = KMeans(n_clusters = 1)
        k_means.fit(field_input_index_reshaped_col)
        field_input_index_clustered_optimal = k_means.labels_
        cluster_centers_sorted2 = k_means.cluster_centers_          
    else:
        for n in range(1, n_cluster):
            if n_samples > n:  # because no. of clusters should be more than the no. of samples/pixels in an image
                k_means = KMeans(n_clusters = n)
                k_means.fit(field_input_index_reshaped_col)  # To get the cluster centers so that they can be sorted for later purpose
                cluster_centers = k_means.cluster_centers_
                cluster_centers_sorted = np.sort(cluster_centers, axis = 0) 
                # Cluster the data again with the fixed cluster centers obtained above for getting an increasing and fixed order of cluster IDS/cluster colors in the clustered image
                k_means2 = KMeans(n_clusters = n, init = cluster_centers_sorted, n_init = 1, max_iter = 1)
                k_means2.fit(field_input_index_reshaped_col)
                field_input_index_clustered = k_means2.labels_
                field_input_index_clustered_reshaped_col = field_input_index_clustered.reshape(-1,1)  # Reshaping cluster IDs from a clustered row (or list obtained using k means) into an array of same size as that of NDVI values variable
                df = pandas.DataFrame(np.hstack((field_input_index_clustered_reshaped_col, field_input_index_reshaped_col)), columns = ['Zone','NDVI'])  # Stacking the two 1D arrays of cluster ID and NDVI values to make a dataframe
                # Write each dataframe to a different worksheet.
                #with ExcelWriter('excelWriterTest.xlsx') as excel_writer:             
                df.to_excel(writer, sheet_name = 'Zones_' + str(n))# Creating a different worksheet for different number of zones clustering
                field_input_index_clustered_im1 = np.copy(outlier_rem_input_array)    #original reshaped input array
                field_input_index_clustered_im1[(Not_Nan_index)] = field_input_index_clustered_reshaped_col[:,0]
                field_input_index_clustered_im1[(Nan_index)] = np.nan       # To black out Nan or outside field boundary pixels in the clustered image                     
                field_input_index_clustered_im = field_input_index_clustered_im1.reshape(field_input_index1.shape) # Reshaping the Clustered array into original image shape for visualization
                Zones_no.append(n)
                ndvi = df['NDVI']
                cluster_id = df['Zone']
                nT = len(df)   # number of pixels in the image
                UniqueClusters = df.Zone.nunique()
                Squared_value = []
                Sigma_cluster_square = []
                for i in range(0, UniqueClusters):
                    ClustNo = i
                    extracted_ndvi = []
                    for index2, pixel_row in df.iterrows():
                        if df.iloc[index2, 0] == ClustNo:        # to read n compare the cluster id (col 0) from excel sheet
                            extracted_ndvi.append(df.iloc[index2, 1])
                    Av_cluster = np.mean(extracted_ndvi)
                    Squared_value = np.square(extracted_ndvi - Av_cluster)
                    Squared_value_sum = np.sum(Squared_value)
                    nZ = len(extracted_ndvi)                         # nZ is the no. of pixels in a cluster
                    Sigma_cluster_square.append((1/1) * (Squared_value_sum) * (1/nT))      # Replaced (1/nz) by (1/1) and (nZ/nT) by (1/nT) coz otherwise getting division by 0 error when number of pixels belonging to any cluster become 0 (i.e., nZ = 0) for any field
                Sigma_total_zone.append(np.sum(Sigma_cluster_square))                 # Zones weight
                Sigma_ref_1cluster = Sigma_total_zone[0]
                # Close the Pandas Excel writer and output the Excel file.
                #excel_writer.save() moved higher up
    writer.save()
    if n_samples > 1:
        Zone_percent = (np.divide(Sigma_total_zone, Sigma_total_zone[0])) * 100       # inter-zone variance
        
        # Display performance graph
        fig1 = plt.figure()
        fig1.patch.set_facecolor('#1B262C')
        
        fig1.patch.set_facecolor('#1B262C')
        plt.plot(Zones_no, Zone_percent)
        plt.xticks(np.arange(min(Zones_no), max(Zones_no) + 1, 1.0))
        plt.xlabel('Number of Zones')
        plt.ylabel('Total Within-Zone Variance (%)')
        plt.title('Performance Graph')
        #plt.show()
        #fig1.savefig('Performance_graphs_socal_apr272018_final/{}'.format('Performance_graph_'+ '.png'), bbox_inches = 'tight', pad_inches = 0.5)
        fig1.savefig('{}'.format(os.path.join(basepath, 'Performance_Graph_image_' + randomString + '.png')), transparent=True, bbox_inches = 'tight', pad_inches = 0.5) 

    #Performance Graph end

    #-----clustered image begin
# Determine Optimal number of zones then cluster the field into optimal zones: 

    for Zones_no_index in range(0, max(Zones_no)):# changed from n_clusters to max(Zones_no) for getting optimal zones for field 358987 which has only 2 clusters, otherwise it went out of index bound
        if (Zones_no_index + 1) < max(Zones_no):
            if (Zone_percent[Zones_no_index] - Zone_percent[Zones_no_index + 1]) < 10:    # optimal zones criteria
                optimal_zones.append(Zones_no_index + 2)                                  # +2 coz index starts from 0 and zones from 1
                optimal_zones_val = Zones_no_index + 2

                # Cluster the field into optimal zones with fixed centroid:
                k_means = KMeans(n_clusters = Zones_no_index + 2)
                k_means.fit(field_input_index_reshaped_col)
                cluster_centers2 = k_means.cluster_centers_
                cluster_centers_sorted2 = np.sort(cluster_centers2, axis = 0) 

                # Cluster the data again with the fixed cluster centers obtained 
                k_means2 = KMeans(n_clusters = Zones_no_index + 2, init = cluster_centers_sorted2, n_init = 1, max_iter = 1)
                k_means2.fit(field_input_index_reshaped_col)
                field_input_index_clustered_optimal = k_means2.labels_

                break
        else:                                                    # If the above mentioned criteria doesn't exist at all, such as when there are only maximum 2 clusters  
                # print('zone percent out of range, above criteria doesnt exist')
                optimal_zones.append(1)
                optimal_zones_val = 1
                k_means = KMeans(n_clusters = 1)
                k_means.fit(field_input_index_reshaped_col)
                field_input_index_clustered_optimal = k_means.labels_
                cluster_centers_sorted2 = k_means.cluster_centers_
            
    field_input_index_clustered_optimal_col = field_input_index_clustered_optimal.reshape(-1,1) 
    field_input_index_clustered_im1_optimal = np.copy(outlier_rem_input_array)    #original reshaped input array
    field_input_index_clustered_im1_optimal[Not_Nan_index] = field_input_index_clustered_optimal_col[:,0]
    field_input_index_clustered_im1_optimal[Nan_index] = np.nan 
    field_input_index_clustered_optimal = field_input_index_clustered_im1_optimal.reshape(field_input_index1.shape)
    plot1 = plt.figure(2)
    plot1.patch.set_facecolor('#1B262C')
    cmap = plt.cm.RdYlGn
    cmap.set_bad(color = 'black')    # To set nan values color as 'black'
    clustered_image_optimal = plt.imshow(field_input_index_clustered_optimal, cmap = plt.cm.RdYlGn, vmin = 0, vmax = optimal_zones_val - 1)                   
    plt.title('Zones Delineation')
    # For Colorbar
    ticks2 = np.linspace(0, optimal_zones_val - 1, optimal_zones_val)                 # to show the ticks same as number of optimal zones/clusters in colorbar
    cbar = plt.colorbar(clustered_image_optimal, shrink = 0.65, ticks = ticks2, label = 'NDVI Value')
    ticks_labels2 = cluster_centers_sorted2                                          # tick labels as the cluster centers of the optimal clustered image
    cbar.set_ticklabels([np.round(value, 2) for value in ticks_labels2])             # to label the colorbar with cluster centers of input index (ex. ndvi)
    plt.rcParams["axes.edgecolor"] = "black"
    plt.rcParams["axes.linewidth"] = 1
    plt.tick_params(top=False, bottom=False, left=False, right=False,
    labelleft=False, labelbottom=False)
    #randomString = str(uuid.uuid4().hex)
    plot1.savefig('{}'.format(os.path.join(basepath, 'Optimal_clustered_image_' + randomString + '.png')), transparent=True, bbox_inches = 'tight', pad_inches = 0.5) 
    #plt.show()   
    if (message == "Zoning may be useful"):   
        optimal_excel = pandas.read_excel(excel_path, sheet_name = 'Zones_' + str(optimal_zones_val), index_col = 0)
        # print(optimal_excel.describe())
        cluster_id1 = optimal_excel['Zone']
        n_samples_total = len(optimal_excel)                                   # number of pixels in the image 
        UniqueClusters1 = optimal_excel.Zone.nunique()
        small_zone_criteria = 10 * n_samples_total / 100                       # 10% of total number of samples/ pixels
        #  print("Total no. of pixels: ", n_samples_total)
        for zone_ind in range(0, optimal_zones_val):
            zone_size = 0
            for index3, pixel_row3 in optimal_excel.iterrows():
                if optimal_excel.iloc[index3, 0] == zone_ind:        # to read n compare the cluster id (col 0) from excel sheet
                    zone_size += 1
#                     print("Zone size: ", zone_size)
            if zone_size <= small_zone_criteria:
                message = "Few zones either consist of boundary pixels or too small. Zoning into rest of the zones may be useful."

    #-----clustered image end
#gdal.AllRegister();
field_input_index = gdal.Open('field_12_google_maps.tif',gdal.GA_ReadOnly)
#field_input_index2 = field_input_index.ReadAsArray()
gt = field_input_index.GetGeoTransform()
xOrigin = gt[0]
yOrigin = gt[3]
pixelWidth = gt[1]
pixelHeight = gt[5]
imageWidth = field_input_index.RasterXSize 
imageHeight = field_input_index.RasterYSize
gdal_obj = field_input_index
wkt = gdal_obj.GetProjection()
def array2raster(newRasterfn, xOrigin, yOrigin, pixelWidth, pixelHeight, array):
    cols = array.shape[1]
    rows = array.shape[0]
    originX = xOrigin
    originY = yOrigin

    driver = gdal.GetDriverByName('GTiff')
    outRaster = driver.Create(newRasterfn, cols, rows,bands= 1, eType = gdal.GDT_Byte)
    outRaster.SetGeoTransform((originX, pixelWidth, 0, originY, 0, pixelHeight))

    outRasterSRS = osr.SpatialReference()
    outRasterSRS.ImportFromWkt(wkt)            
    outRaster.SetProjection(outRasterSRS.ExportToWkt())

    outband = outRaster.GetRasterBand(1)
    outband.WriteArray(array)
    outband.FlushCache()



def main():
    getmap(latitude, longitude, length, width, zoom, pixelHeight)
    outlier_removal2D(field_input_index1, array_size1, array_size2, win_size)
    outlier_rem_array_im = field_input_index1 #np.reshape(field_input_index1, (-1, 8))
    with open(os.path.join(basepath, 'Optimal_clustered_image_' + randomString + '.png'), "rb") as file:
        delineationImage = file.read()
    with open(os.path.join(basepath, 'Performance_Graph_image_' + randomString + '.png'), "rb") as file:
        performanceGraphImage = file.read()
    delineationImage = base64.b64encode(delineationImage).decode('utf-8')
    performanceGraphImage = base64.b64encode(performanceGraphImage).decode('utf-8')
    #print("image",base64Image)
    outputDict = {
    "mean": round(field_input_index1_mean,2),
    "max": round(field_input_index1_max,2),
    "min": round(field_input_index1_min,2),
    "std": round(field_input_index1_std,2),
    "ndvi_range": round(ndvi_range_value,2),
    "clusters": optimal_zones_val,
    "message": message,
    "delineationImage" : delineationImage,
    "performanceGraphImage" : performanceGraphImage,
    "randomID": randomString
    }
    newRasterfn = "./tmp/field_12_test.tif"  #ouput geoTif that gets converted to png below with gda.Translate
    array2raster(newRasterfn, xOrigin, yOrigin, pixelWidth, pixelHeight, field_input_index_clustered_optimal)
    options_list = [
    '-ot Byte',
    '-of PNG',
    '-b 1',
    '-outsize ' + str(imageWidth) + ' ' + str(imageHeight),
    '-scale'
    ]           
    options_string = " ".join(options_list)
    gdal.Translate(
    './tmp/Georeference_image_' + randomString + ".png",
    "field_12_test.tif",
    options=options_string
    )

    cm_hot = mpl.cm.get_cmap('rainbow')
    img_src = Image.open('./tmp/Georeference_image_' + randomString + ".png").convert('L')
    im = np.array(img_src)
    im = cm_hot(im)
    im = np.uint8(im * 255)
    im = Image.fromarray(im)
    im.save('./tmp/Georeference_image_colormap_' + randomString + '.png')
    img1 = Image.open(r"field_12_google_maps.tif") #image from google maps api to use as background
    #img2 = Image.open(r"./tmp/field_12_georeference.png")
    img2 = Image.open(r'./tmp/Georeference_image_colormap_' + randomString + '.png')
    img2.show()
    #img1.paste(img2, (0,0), mask = img2)
    # Displaying the image
    img1.show()
    img1Converted = img1.convert('RGB')
    img2Converted = img2.convert('RGB')
    blended = Image.blend(img1Converted, img2Converted, alpha=.2)
    blended.show()
    os.remove("./tmp/Optimal_clustered_image_" + randomString + ".png")
    os.remove("./tmp/Performance_Graph_image_" + randomString + ".png")
    os.remove("./tmp/Cluster_info_" + randomString + ".xlsx")
    os.remove('./tmp/Georeference_image_' + randomString + ".png")
    os.remove('./tmp/Georeference_image_' + randomString + ".png.aux.xml")
    os.remove('./tmp/Georeference_image_colormap_' + randomString + '.png')
    outputDictJSON = json.dumps(outputDict)
    print(outputDictJSON) #outputs the dictionary of results as json
    sys.stdout.flush() #for sending data back to node.js
    return 0
main()

'''

'''