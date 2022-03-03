import requests


def getmap(lat, lon, filelength, filewidth, zoom, pixelheight):
    api_key = ""


    url = 'https://maps.googleapis.com/maps/api/staticmap?maptype=satellite'
    
    #center
    lat = format(lat, '.6f')
    lon = format(lon, '.6f')
    url = url + '&center=' + str(lat) + ',' + str(lon)

    #size
    maplength = filelength * pixelheight
    mapwidth = filewidth * pixelheight
    url = url + '&size=' + str(mapwidth) + 'x' + str(maplength)

    #zoom
    url = url + '&zoom=' + str(zoom)

    #api key
    url = url + '&key=' + api_key

    #print('request: ', url)
    r = requests.get(url)

    # i = open("request.txt", "a")
    # i.write(url)
    # i.close()

    f = open('./tmp/map{},{}.png'.format(lat,lon), 'wb')  
    f.write(r.content)
    f.close()