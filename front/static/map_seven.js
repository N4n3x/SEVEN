// Leaflet Embedded: PIC'UP Enedis - 2019 - V1.02
"use strict";

class Seven_map {
    constructor(targetId, lat, lng, zoom) {
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
        this.localUrl = 'http://192.168.8.164:5000/weather/temperature';
        this.devUrl = 'http://192.168.8.164:5000/weather/temperature';
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
        let rep = $.get(window.location.hostname == "localhost" ? site_map.localUrl : site_map.devUrl, function(data) {
            return data
        });
        let data = rep;
        return data;
    }

    Add_markers_on_map(data, filter = {}) {
        let site_map = this;
        let geoData = data.map(function(location){
            return {
                type: 'Feature',
                geometry: {
                type: 'Point',
                    coordinates: [location.longitude, location.latitude]
                },
                properties: {
                    location
                }
            }
        }); 
        // this.RemoveLayer("site");
        L.geoJson(geoData, {
            onEachFeature: function (feature, layer) {
                // layer.setIcon(site_map.icons.default);
               
                let html = '<h5>' + feature.properties.ville + ': <b>' + feature.properties.id_station + '</b></h5>';
                // if (filter) {
                //     for (const [key, value] of Object.entries(filter)) {
                //         if (Array.isArray(value)) {
                //             value.forEach((e) => {
                //                 html = html + '<span class="badge bg-light-blue">' + e + ': ' + feature.properties[key][e] + '</span>';
                //             });
                //         } else {
                //             html = html + '<span class="badge bg-light-blue">' + value + ': ' + feature.properties[key][value] + '</span>';
                //         }
                //     };
                //     layer.bindPopup(
                //         html +
                //         '<br>' + feature.properties.adresse + '<br>' + feature.properties.code_postal + ' ' + feature.properties.ville + '<br>' +
                //         '<br><a href="site/' + feature.id + '/index" role="button" class="btn btn-primary btn-sm btn-block active"><i class="fas fa-search-location a-margin-right"></i> Consulter</a>',
                //         site_map.customOptions
                //     );
                // } else {
                //     layer.bindPopup(
                //         html +
                //         '<br>' +feature.properties.adresse + '<br>' + feature.properties.code_postal + ' ' + feature.properties.ville + '<br>' +
                //         '<br><a href="site/' + feature.id + '/index" role="button" class="btn btn-primary btn-sm btn-block active"><i class="fas fa-search-location a-margin-right"></i> Consulter</a>',
                //         site_map.customOptions
                //     );
                // }
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
            console.log(data);
            // site_map.Init_sites_list(data, filter);
            site_map.Add_markers_on_map(data, filter);
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








