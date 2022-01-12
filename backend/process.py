import pandas
from pandas import ExcelWriter
import numpy as np
from scipy.sparse.construct import rand
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt
import sys
import json
import uuid
import base64
import os
basepath = os.path.abspath('tmp')
arg1 = sys.argv[1]

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
message = ""

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
    global message    
    global Nan_index 
    global Not_Nan_index
    global randomString
    randomString = str(uuid.uuid4().hex)
    field_input_index1_mean = np.mean(field_input_index1[ind_nonan]) 
    field_input_index1_max = np.amax(field_input_index1[ind_nonan])
    field_input_index1_min = np.amin(field_input_index1[ind_nonan])
    field_input_index1_std = np.std(field_input_index1[ind_nonan]) 
    #print("mean: ",field_input_index1_mean)
    #print("max: ",field_input_index1_max)
    #print("min: ",field_input_index1_min)
    #print("std: ",field_input_index1_std)                

    field_input_index1 = np.reshape(field_input_index1, (-1, 8))
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
    n_samples = 96;
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
                excel_path = os.path.join('./tmp', 'Cluster_info_' + randomString + str(n) + '.xlsx')
                writer = pandas.ExcelWriter(excel_path, engine = 'xlsxwriter')                    
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
        plt.plot(Zones_no, Zone_percent)
        plt.xticks(np.arange(min(Zones_no), max(Zones_no) + 1, 1.0))
        plt.xlabel('Number of Zones')
        plt.ylabel('Total Within-Zone Variance (%)')
        plt.title('Performance Graph for Field ')
        #plt.show()
        #fig1.savefig('Performance_graphs_socal_apr272018_final/{}'.format('Performance_graph_'+ '.png'), bbox_inches = 'tight', pad_inches = 0.5)
        fig1.savefig('{}'.format(os.path.join(basepath, 'Performance_Graph_image_' + randomString + '.png')), bbox_inches = 'tight', pad_inches = 0.5) 

    #Performance Graph end
    optimalClusters = 5
    k_means = KMeans(n_clusters = optimalClusters)
    k_means.fit(field_input_index_reshaped_col)
    field_input_index_clustered_optimal = k_means.labels_
    cluster_centers_sorted = k_means.cluster_centers_
    field_input_index_clustered_optimal_col = field_input_index_clustered_optimal.reshape(-1,1) 
    field_input_index_clustered_im1_optimal = np.copy(outlier_rem_input_array)    #original reshaped input array
    field_input_index_clustered_im1_optimal[Not_Nan_index] = field_input_index_clustered_optimal_col[:,0]
    field_input_index_clustered_im1_optimal[Nan_index] = np.nan 
    field_input_index_clustered_optimal = field_input_index_clustered_im1_optimal.reshape(field_input_index1.shape)
    plot1 = plt.figure(2)
    cmap = plt.cm.RdYlGn
    cmap.set_bad(color = 'black')    # To set nan values color as 'black'
    clustered_image_optimal = plt.imshow(field_input_index_clustered_optimal, cmap = plt.cm.RdYlGn, vmin = 1, vmax = optimalClusters- 1)                   
    plt.title('Zones Delineation for the Field')         
    # For Colorbar
    ticks2 = np.linspace(0, optimalClusters - 1, optimalClusters) # to show the ticks same as number of optimal zones/clusters in colorbar
    cbar = plt.colorbar(clustered_image_optimal, shrink = 0.9, ticks = ticks2, label = 'NDVI Value')
    ticks_labels2 = cluster_centers_sorted     # tick labels as the cluster centers of the optimal clustered image
    cbar.set_ticklabels([np.round(value, 3) for value in ticks_labels2]) # to label the colorbar with cluster centers of input index (ex. ndvi)
    plt.axis('off')
    #randomString = str(uuid.uuid4().hex)
    plot1.savefig('{}'.format(os.path.join(basepath, 'Optimal_clustered_image_' + randomString + '.png')), bbox_inches = 'tight', pad_inches = 0.5) 
    #plt.show()   


def main():
    outlier_removal2D(field_input_index1, array_size1, array_size2, win_size)
    outlier_rem_array_im = field_input_index1 #np.reshape(field_input_index1, (-1, 8))
    '''for p in range(array_size1):
        for q in range(array_size2):
            if outlier_rem_array_im[p,q] != field_input_index_test[p,q]:
                print(field_input_index_test[p,q])#for testing purposes
    '''
    bestN = 0
    maxCoeff = -1
    #outlier_rem_array_im = np.reshape(outlier_rem_array_im, (-1, 8))
    for n_cluster in range(2, 10):
        k_means = KMeans(n_clusters=n_cluster).fit(outlier_rem_array_im)
        label = k_means.labels_
        sil_coeff = silhouette_score(outlier_rem_array_im, label, metric='euclidean')
        if(sil_coeff > maxCoeff):
            maxCoeff = sil_coeff
            bestN = n_cluster
        #print("For n_clusters={}, The Silhouette Coefficient is {}".format(n_cluster, sil_coeff))#uncomment for testing
    #print("clusters: ", bestN)
    #ax = X_cluster.plot(figsize=(10, 10), alpha=0.5, edgecolor='k')
    #plot1.savefig('Optimal_clustered_images/{}'.format('Optimal_clustered_image1' + '.png'), bbox_inches = 'tight', pad_inches = 0.5)

    '''print(field_input_index_clustered_optimal)
    outlier_rem_array_im = np.reshape(outlier_rem_array_im, (-1, 8))
    plt.scatter(outlier_rem_array_im[:,0],outlier_rem_array_im[:,0], c = k_means.labels_,cmap='rainbow')
    plt.show()
    '''
    with open(os.path.join(basepath, 'Optimal_clustered_image_' + randomString + '.png'), "rb") as file:
        img = file.read()
    img = base64.b64encode(img).decode('utf-8')
    #print("image",base64Image)
    outputDict = {
    "mean": field_input_index1_mean,
    "max": field_input_index1_max,
    "min": field_input_index1_min,
    "std": field_input_index1_std,
    "clusters": bestN,
    "message": message,
    "image" : img,
    "randomID": randomString
    }
    outputDictJSON = json.dumps(outputDict)
    print(outputDictJSON) #outputs the dictionary of results as json
    sys.stdout.flush() #for sending data back to node.js
    return 0
main()

'''

'''