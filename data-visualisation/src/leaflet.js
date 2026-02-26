const map = L.map('map', {zoomSnap: 0.25}).setView([52.17, 6.55], 7.5);

const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}).addTo(map);

// control that shows state info on hover
const info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	const contents = props ? `<b>${props.statnaam}</b><br />1 : ${props.ParkPerResidential} Urban Green / Residential <br> Ranked #${props.rank}<br> UGP: ${props.Urban_Green_Perc}%` : 'Hover over a municipality';
	this._div.innerHTML = `<h4 style = 'color: #5a5a5a;	'>Urban Green to Residential Ratio</h4>${contents}`;
};

info.addTo(map);

function getColor(d) {
	return d > 15   ? '#0B5B02' :
		d > 12.5   ? '#3E800F' :
		d > 10 ? '#86A32A' :
		d > 7.5  ? '#C3B33F' :
		d > 5 ? '#BD7220' :	 
		d > 0 ? '#B73100' :   
		d <= 0   ? '#c7c7c7' : '#c7c7c7';
}

// function getColor(d) {
// 	return d > 15   ? '#056f26' :
// 		d > 12.5   ? '#71bf60' :
// 		d > 10 ? '#9bb950' :
// 		d > 7.5  ? '#b2b03f' :
// 		// d > 0.075 ? '#aa882c' :
// 		d > 5 ? '#a14e17' :	 
// 		d > 0 ? '#871313' :   
// 		d <= 0   ? '#c7c7c7' : '#c7c7c7';
// }

function style(feature) {
	return {
		weight: 0.75,
		opacity: 1,
		color: 'white',
		// dashArray: '',
		fillOpacity: 0.7,
		fillColor: getColor(feature.properties.Urban_Green_Perc)
	};
}

function highlightFeature(e) {
	const layer = e.target;

	layer.setStyle({
		weight: 3,
		color: '#46a6fa',
		dashArray: '',
		fillOpacity: 0.7
	});

	layer.bringToFront();

	info.update(layer.feature.properties);
}


var geojson2022 = L.geoJson(data2022, {
	style,
	onEachFeature,
	time: '2022'
});

var geojson2020 = L.geoJson(data2020, {
	style,
	onEachFeature,
	time: '2020'
});

var geojson2017 = L.geoJson(data2017, {
	style,
	onEachFeature,
	time: '2017'
});

var geojson2015 = L.geoJson(data2015, {
	style,
	onEachFeature,
	time: '2015'
});

var geojson2012 = L.geoJson(data2012, {
	style,
	onEachFeature,
	time: '2012'
});

var geojson2010 = L.geoJson(data2010, {
	style,
	onEachFeature,
	time: '2010'
});

var geojson2008 = L.geoJson(data2008, {
	style,
	onEachFeature,
	time: '2008'
});

var geojson2006 = L.geoJson(data2006, {
	style,
	onEachFeature,
	time: '2006'
});

var geojson2003 = L.geoJson(data2003, {
	style,
	onEachFeature,
	time: '2003'
});

var geojson2000 = L.geoJson(data2000, {
	style,
	onEachFeature,
	time: '2000'
});

var geojson1996 = L.geoJson(data1996, {
	style,
	onEachFeature,
	time: '1996'
});

function resetHighlight(e) {
	geojson2022.resetStyle(e.target);
	info.update();
}

let barChart = null;
let lineChart = null;
const sidebarContent = document.getElementById('sidebar-content');
const topsidebarContent = document.getElementById('topsidebar-content');

function chartMunicipality(targetName) {
  // Filter for municipality and sort by year to ensure chronological order
  const features = (dataAll.features || [])
    .filter(feature => feature.properties?.statnaam === targetName)
    .sort((a, b) => a.properties.Jaar - b.properties.Jaar);

  // Map values directly to preserve array alignment
  const year_array = features.map(f => f.properties.Jaar);
  const green_array = features.map(f => f.properties.Urban_Green_Perc);
  const grey_array = features.map(f => f.properties.Residential_Perc);
//   const green_ha_array = features.map(f => f.properties.Fraction);

  return [green_array, grey_array, year_array];
}

function renderOrUpdateChart(targetName) {
  const [green_array, grey_array, year_array] = chartMunicipality(targetName);
  const ctx = document.getElementById('barchart');

  if (barChart) {
    // Update existing chart
    barChart.data.labels = year_array;
    barChart.data.datasets[0].data = grey_array;
    barChart.data.datasets[1].data = green_array;
    barChart.update();
  } else {
    // Create new chart instance
    barChart = new Chart(ctx, {
      type: 'bar',
      data: { 
        labels: year_array,
        datasets: [
          {
            label: 'Residential',
            data: grey_array,
            borderWidth: 1,
            backgroundColor: '#99a194'
          },
          {
            label: 'Urban Green',
            data: green_array,
            borderWidth: 1,
            backgroundColor: '#72a155'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        }
      }
    });
  }

  	const ctx2 = document.getElementById('linechart');

	if(lineChart) {
 	lineChart.data.labels = year_array;
	lineChart.data.datasets[0].data = green_array;
    lineChart.update();
	} else {
	lineChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: year_array,
      datasets: [
    {
        label: 'Municipality (UGP)',
        data: green_array,
        borderWidth: 5,
        backgroundColor: '#72a155',
        borderColor: '#72a155'
      },
	  {
        label: 'Dutch Average (UGP)',
        data: [6.23, 6.70, 7.58, 7.87, 7.95, 8.15, 8.32, 8.70, 9.03, 12.41, 12.18],
        borderWidth: 2,
        backgroundColor: '#8aa679',
        borderColor: '#8aa679',
        borderDash: [5, 5]
      },
    ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: 10
        },
      scales: {
        x: {
            stacked: false
        },
        y: {
            stacked: false,
            beginAtZero: true
        }
      }
    }
  });
}};




function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click:  function (e) {
			const statnaam = feature.properties.statnaam;
            // sidebarContent.innerHTML = `<p><strong>Statnaam:</strong> ${feature.properties.statnaam} <br> 1 : ${feature.properties.ParkPerResidential}</p>`;
			// sidebarContent.innerHTML = `<p style="font-size:large; font-weight:bold;">Wageningen</p><img src="images/image.png" alt="charts" style="height:800px; margin-left:40px"><br><br>insert ranking and other info <br>please ignore aesthetics`;
			// sidebarContent.innerHTML = `<canvas id="barchart"></canvas>	`;
			const chartLayoutHTML = `
  				<div style="display: flex; flex-direction: column; height: 100%; gap: 0px; padding-right: 20px">
					
    				<div style="flex: 1; position: relative; min-height: 250px; margin-top: 0px; margin-bottom: 0px;">
      					<canvas id="barchart"></canvas>
    				</div>
    				<div style="flex: 1; position: relative; min-height: 250px; margin-bottom: 10px;">
     					<canvas id="linechart"></canvas>
    				</div>
						<div id='topsidebar-content' style="margin-top: 0px; margin-left: 20px; font-size: 15px; font-weight: 600; text-align: justify;">Is the UGP below the Dutch average? </div>
						<div id='topsidebar-content' style="margin-top: 0px; margin-left: 20px; font-size: 14px; font-weight: 500; text-align: justify;">Consider creating more urban green areas to provide a green space for your residents.</div>  				
					</div> `;
			
			topsidebarContent.innerHTML = `<p style="margin-top: 0px; margin-bottom: 0px; margin-right: 0px">${feature.properties.statnaam}</p>
			<p id='topsidebar-content' style="margin-top: 10px; margin-bottom: 0px; margin-left: 20px; font-size: 13.5px; font-weight: 500; font-style: italic; text-align: justify;">Hover over the graphs to see more details on the Urban Green to Residential Ratio or the UGP.</p>`;
			if (!document.getElementById('barchart') || !document.getElementById('linechart')) {
        	sidebarContent.innerHTML = chartLayoutHTML;
        	barChart = null; lineChart = null;}

      		renderOrUpdateChart(statnaam);			
			
			map.fitBounds(e.target.getBounds(),{ animate: true});
		} 
	});

	
}



// function chartMunicipality(targetName) {
//   const features = dataAll.features || [];
//   const green_features = features
//     .filter(feature => feature.properties?.statnaam === targetName)
//     .map(feature => feature.properties?.Urban_Green_Perc)
//     .filter(year => year !== undefined && year !== null);
//   const green_array = [...new Set(green_features)];

//   const grey_features = features
//     .filter(feature => feature.properties?.statnaam === targetName)
//     .map(feature => feature.properties?.Residential_Perc)
//     .filter(year => year !== undefined && year !== null);
//   const grey_array = [...new Set(grey_features)];

//   const year_features = features
//     .filter(feature => feature.properties?.statnaam === targetName)
//     .map(feature => feature.properties?.Jaar)
//     .filter(year => year !== undefined && year !== null);
//   const year_array = [...new Set(year_features)];

//  return [green_array, grey_array, year_array]; 

// }

// let [green_array, grey_array, year_array] = chartMunicipality('Zeewolde');
// const ctx = document.getElementById('barchart');

map.attributionControl.addAttribution('Data &copy; <a href="https://opendata.cbs.nl/">Centraal Bureau voor de Statistiek</a>');


const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	const div = L.DomUtil.create('div', 'info legend');
	const grades = ['na', 0, 5, 7.5, 10, 12.5, 15];
	// const grades = [0, 1, 1, 0, 0, 1];
	const labels = [];
	let from, to;

	for (let i = 0; i < grades.length; i++) {
		from = grades[i];
		from_text = ['na','0&ndash;5%','5&ndash;7.5%','7.5&ndash;10%','10&ndash;12.5%', '12.5&ndash;15%','15%+',];
		// colours = ['#c7c7c7', '#871313', '#a14e17', '#b2b03f', '#71bf60', '#056f26'];
		to = grades[i + 1];

		labels.push(`<i style="background:${getColor(from+0.01)}"></i> ${from_text[i]}`);
		// labels.push(`<i style="background:${getColor(from+0.01)}"></i> ${from}${to ? `&ndash;${to}` : ''}`);
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

legend.addTo(map);

// const overlays = {
// 	'1996': geojson1996,
// 	'2022': geojson2022
// };

// const layerControl = L.control.layers(overlays).addTo(map);

var searchControl = new L.Control.Search({
		layer: geojson2022,
		propertyName: 'statnaam',
		marker: false,
		moveToLocation: function(latlng, title, map) {
			//map.fitBounds( latlng.layer.getBounds() );
			var zoom = map.getBoundsZoom(latlng.layer.getBounds());
  			map.setView(latlng, zoom); // access the zoom
		}
	});

	searchControl.on('search:locationfound', function(e) {
		
		//console.log('search:locationfound', );

		//map.removeLayer(this._markerSearch)

		// e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
		if(e.layer._popup)
			e.layer.openPopup();

	}).on('search:collapsed', function(e) {

		geojson2022.eachLayer(function(layer) {	//restore feature color
			geojson2022.resetStyle(layer);
		});	
	});
	
	map.addControl( searchControl );  //inizialize search control

	layerGroup = L.layerGroup([geojson1996, geojson2000, geojson2003, geojson2006, geojson2008, geojson2010, geojson2012, geojson2015, geojson2017, geojson2020, geojson2022]);
	var sliderControl = new L.Control.SliderControl({
  		layer: layerGroup,
		follow: 1
	});

	map.addControl(sliderControl);
	sliderControl.startSlider();

	