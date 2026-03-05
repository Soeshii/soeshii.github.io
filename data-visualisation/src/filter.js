let filterSwitchBottom = false;
let filterSwitchTop = false;

function toggleBottom() {
    filterSwitchBottom = filterSwitchBottom ? false : true;
    layerGroup = [geojson1996, geojson2000, geojson2003, geojson2006, geojson2008, geojson2010, geojson2012, geojson2015, geojson2017, geojson2020, geojson2022];
    layerGroup.forEach (layer => {
        layer.clearLayers();
        layer.addData(layer.data);
    });
}

function toggleTop() {
    filterSwitchTop = filterSwitchTop ? false : true;
    layerGroup = [geojson1996, geojson2000, geojson2003, geojson2006, geojson2008, geojson2010, geojson2012, geojson2015, geojson2017, geojson2020, geojson2022];
    layerGroup.forEach (layer => {
        layer.clearLayers();
        layer.addData(layer.data);
    });
}

function filterFeature(feature) {
    const yearlyMunicipalities = {
			1996: 625, 2000: 537, 2003: 489, 2006: 458, 2008: 443, 2010: 431, 2012: 415, 2015: 393, 2017: 388, 2020: 355, 2022: 345};

    if (filterSwitchBottom == true && filterSwitchTop == false) {
        if (feature.properties.rank >= yearlyMunicipalities[feature.properties.Jaar] - 25) {
		    return true;
	    } else {
		    return false;}
    } else if (filterSwitchBottom == false && filterSwitchTop == true) {
        if (feature.properties.rank <= 25) {
		    return true;
	    } else {
		    return false;}
    } else if (filterSwitchBottom == true && filterSwitchTop == true) {
        if (feature.properties.rank <= 25) {
		    return true;
        } else if (feature.properties.rank >= yearlyMunicipalities[feature.properties.Jaar] - 25) {
		    return true;
	    } else {
		    return false;}         
    } else {return true};  
};

$(document).ready(function () {
            $("#buttonTop").click(function () {
            $(this).css("background-color", filterSwitchTop ? "#72a155" : "#rgba(255,255,255,0.8)"); 
            $(this).css("color", filterSwitchTop ? 'white' : "#72a155"); });
            $("#buttonBottom").click(function () {
            $(this).css("background-color", filterSwitchBottom ? "#a15555" : "#rgba(255,255,255,0.8)"); 
            $(this).css("color", filterSwitchBottom ? 'white' : "#a15555"); });
});
        
