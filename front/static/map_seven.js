// Leaflet Embedded: PIC'UP Enedis - 2019 - V1.02
"use strict";

class Seven_map {
    constructor(targetId, lat, lng, zoom, apiurl) {
        this.targetId = targetId;
        this.map;
        this.marker;
        this.ajaxRequest;
        this.coordinates;
        this.lat = lat;
        this.lng = lng;
        this.zoom = zoom;
        this.mapLayerGroups = [];
        this.geoData;
        this.customOptions = {
            'minWidth': '100',
            'className': 'custom'
        };
        // this.localUrl = 'http://192.168.8.164:5000/weather/temperature';
        this.devUrl = apiurl;
        this.leafletUrl = 'https://tile.jawg.io/jawg-streets/{z}/{x}/{y}.png?access-token=';
        this.leafletAttrib = {
            minZoom: 4,
            maxZoom: 22,
            attribution: 'jawg & data.gouv.fr'
        };
        this.leafletKeyJawg = '4cKtE4Rze1HrvxWa9a7mdolSk10lVThTFC8zadQYMIMxTjkpTeIDJAAmhReDGnCH';
        this.lunchMap;
        this.initmap();
    }

    initmap() {
        // set up the map (by the ID div)
        this.map = new L.Map(this.targetId);
        this.lunchMap = new L.TileLayer(this.leafletUrl + this.leafletKeyJawg, this.leafletAttrib);
        this.map.setView(new L.LatLng(this.lat, this.lng), this.zoom);
        this.map.addLayer(this.lunchMap);
    }

    Get_geojson() {
        let site_map = this;
        let rep = $.get(site_map.devUrl, function (data) {
            return data
        });

        // let rep = $.get(window.location.hostname == "localhost" ? site_map.localUrl : site_map.devUrl, function(data) {
        //     return data
        // });

        return rep;
    }

    Add_markers_on_map(data, filter = {}) {
        // console.log(data);
        let site_map = this;
        
        L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                // console.log(feature);
                let html = '<h5>' + feature.properties.ville + ': <b>' + feature.properties.id_station + '</b></h5><br>';
                let keys = Object.keys(feature.properties)
                keys.forEach((key)=>{
                    // console.log(key)
                    if(key.split("/").length > 1){
                        html = html + key + " : Température " + feature.properties[key]["temperature"] + ", Humidité " + feature.properties[key]["humidite"] + "<br>";
                    }
                });
                html = html + "<a href='./graphique/" + feature.properties.id_station + "'>Graphique</a>";
                layer.bindPopup(html);
                
                let lg = site_map.mapLayerGroups[feature.properties.ville];
                if (lg === undefined) {
                    lg = new L.layerGroup();
                    //add the layer to the map
                    lg.addTo(site_map.map);
                    //store layer
                    site_map.mapLayerGroups[feature.properties.ville] = lg;
                }
                //add the feature to the layer
                lg.addLayer(layer);
            }
        });
    }

    Display(filter = {}) {
        let site_map = this;
        this.Get_geojson().then(data => {
            // console.log(data);

            let formated_data = {
                "type": "FeatureCollection",
                "features": []
            };
            data.forEach(element => {
                let date = moment.unix(element.timestamp).format("DD/MM/YYYY HH:mm");
                // let temp = []
                // temp[moment.unix(element.timestamp).format("DD/MM/YYYY HH:mm")] = element
                // console.log(temp)
                let test = formated_data.features.find((e) => {
                    // console.log(e)
                    return e.properties.id_station == element.id_station
                });
                

                if(typeof test == "undefined"){
                    console.log(test)
                    formated_data.features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [element.longitude, element.latitude]
                        },
                        properties: {
                            "ville": element.ville,
                            "id_station": element.id_station,
                            "id_sonde": element.id_sonde,
                            date : element
                        }
                    });
                }else{
                    test.properties[moment.unix(element.timestamp).format("DD/MM/YYYY HH:mm")] = element;
                }

            });
            console.log(formated_data)
            // site_map.Init_sites_list(data, filter);
            site_map.Add_markers_on_map(formated_data, filter);
        });
    }

    SinglePoint(site_id, icon_style, icon_color, marker_color) {

        let SiteIcon = L.AwesomeMarkers.icon({
            icon: icon_style,
            prefix: 'fa',
            iconColor: icon_color,
            markerColor: marker_color,
            spin: false
        });
        const site_map = this;
        this.geojsonLayerSingleSite = new L.GeoJSON.AJAX(window.location.hostname == "localhost" ? site_map.localUrl + site_id : site_map.devUrl + site_id, {
            middleware: function (data) {
                return L.geoJson(data, {
                    onEachFeature: function (feature, layer) {
                        layer.setIcon(SiteIcon);
                    }
                }).addTo(site_map.map);
            }
        });
    }

    RemoveLayer(type) {
        if (this.mapLayerGroups[type] != undefined) this.map.removeLayer(this.mapLayerGroups[type]);
        this.mapLayerGroups[type] = undefined;
    }



}








