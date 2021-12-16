import pandas
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
    randomString = str(uuid.uuid4().hex)
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