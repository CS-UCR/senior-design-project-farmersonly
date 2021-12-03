import pandas
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt
import sys
import json
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
    field_input_index1 = np.reshape(field_input_index1, (-1, 1))#convert back to 1D array (maybe not needed)
    
    outlier_rem_input_array = field_input_index1
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

# ip_msg.append("Zoning may be useful") # No warnings msg

def main():
    outlier_removal2D(field_input_index1, array_size1, array_size2, win_size)
    outlier_rem_array_im = field_input_index1
    '''for p in range(array_size1):
        for q in range(array_size2):
            if outlier_rem_array_im[p,q] != field_input_index_test[p,q]:
                print(field_input_index_test[p,q])#for testing purposes
    '''
    bestN = 0
    maxCoeff = -1
    #outlier_rem_array_im = np.reshape(outlier_rem_array_im, (-1, 8))
    for n_cluster in range(2, 20):
        k_means = KMeans(n_clusters=n_cluster).fit(outlier_rem_array_im)
        label = k_means.labels_
        sil_coeff = silhouette_score(outlier_rem_array_im, label, metric='euclidean')
        if(sil_coeff > maxCoeff):
            maxCoeff = sil_coeff
            bestN = n_cluster
        #print("For n_clusters={}, The Silhouette Coefficient is {}".format(n_cluster, sil_coeff))#uncomment for testing
    #print("clusters: ", bestN)
    k_means = KMeans(n_clusters = bestN)
    k_means.fit(outlier_rem_array_im)
    field_input_index_clustered_optimal = k_means.labels_#.reshape(k_means.labels_.shape[0],1)
    '''print(field_input_index_clustered_optimal)
    outlier_rem_array_im = np.reshape(outlier_rem_array_im, (-1, 8))
    plt.scatter(outlier_rem_array_im[:,0],outlier_rem_array_im[:,0], c = k_means.labels_,cmap='rainbow')
    plt.show()
    '''
    outputDict = {
    "mean": field_input_index1_mean,
    "max": field_input_index1_max,
    "min": field_input_index1_min,
    "std": field_input_index1_std,
    "clusters": bestN,
    "message": message
    }
    outputDictJSON = json.dumps(outputDict)
    print(outputDictJSON) #outputs the dictionary of results as json
    sys.stdout.flush() #for sending data back to node.js
    return 0
main()

'''

'''