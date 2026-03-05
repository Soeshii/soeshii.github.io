const map = L.map('map', {zoomSnap: 0.25}).setView([52.17, 6.55], 7.5);

const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}).addTo(map);

const info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	const yearlyMunicipalities = {
			1996: 625, 2000: 537, 2003: 489, 2006: 458, 2008: 443, 2010: 431, 2012: 415, 2015: 393, 2017: 388, 2020: 355, 2022: 345
			};
	const contents = props ? `<b>${props.statnaam}</b><br />1 : ${props.ParkPerResidential} Urban Green / Residential <br> Ranked #${props.rank} out of ${yearlyMunicipalities[props.Jaar]}<br> UGP: ${props.Urban_Green_Perc}%` : 'Hover over a municipality';
	this._div.innerHTML = `<h4 style = 'color: #39502b;	'>Urban Green to Residential Ratio</h4>${contents}`;
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

function style(feature) {
	return {
		weight: 0.75,
		opacity: 1,
		color: 'white',
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

var geojson1996 = L.geoJson(data1996, {
	style,
	onEachFeature,
	time: '1996',
	filter: filterFeature
});
geojson1996.data = data1996;

var geojson2000 = L.geoJson(data2000, {
	style,
	onEachFeature,
	time: '2000',
	filter: filterFeature
});
geojson2000.data = data2000;

var geojson2003 = L.geoJson(data2003, {
	style,
	onEachFeature,
	time: '2003',
	filter: filterFeature
});
geojson2003.data = data2003;

var geojson2006 = L.geoJson(data2006, {
	style,
	onEachFeature,
	time: '2006',
	filter: filterFeature
});
geojson2006.data = data2006;

var geojson2008 = L.geoJson(data2008, {
	style,
	onEachFeature,
	time: '2008',
	filter: filterFeature
});
geojson2008.data = data2008;

var geojson2010 = L.geoJson(data2010, {
	style,
	onEachFeature,
	time: '2010',
	filter: filterFeature
});
geojson2010.data = data2010;

var geojson2012 = L.geoJson(data2012, {
	style,
	onEachFeature,
	time: '2012',
	filter: filterFeature
});
geojson2012.data = data2012;

var geojson2015 = L.geoJson(data2015, {
	style,
	onEachFeature,
	time: '2015',
	filter: filterFeature
});
geojson2015.data = data2015;

var geojson2017 = L.geoJson(data2017, {
	style,
	onEachFeature,
	time: '2017',
	filter: filterFeature
});
geojson2017.data = data2017;

var geojson2020 = L.geoJson(data2020, {
	style,
	onEachFeature,
	time: '2020',
	filter: filterFeature
});
geojson2020.data = data2020;

var geojson2022 = L.geoJson(data2022, {
	style,
	onEachFeature,
	time: '2022',
	filter: filterFeature
});
geojson2022.data = data2022;


function resetHighlight(e) {
	geojson2022.resetStyle(e.target);
	info.update();
}

let barChart = null;
let lineChart = null;
const sidebarContent = document.getElementById('sidebar-content');
const topsidebarContent = document.getElementById('topsidebar-content');
const bottomsidebarContent = document.getElementById('bottomsidebar-content');

function chartMunicipality(targetName) {
  	const features = (dataAll.features || [])
    	.filter(feature => feature.properties?.statnaam === targetName)
    	.sort((a, b) => a.properties.Jaar - b.properties.Jaar);

	const year_array = features.map(f => f.properties.Jaar);
	const green_array = features.map(f => f.properties.Urban_Green_Perc);
	const grey_array = features.map(f => f.properties.Residential_Perc);

  	return [green_array, grey_array, year_array];
}

function renderOrUpdateChart(targetName) {
  const [green_array, grey_array, year_array] = chartMunicipality(targetName);
  const ctx = document.getElementById('barchart');

  if (barChart) {
    barChart.data.labels = year_array;
    barChart.data.datasets[0].data = grey_array;
    barChart.data.datasets[1].data = green_array;
    barChart.update();
  } else {
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
          y: { stacked: true, beginAtZero: true, ticks: {callback: function(value, index, values) {return value + "%";}} }
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
        backgroundColor: '#78a45d46',
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
            beginAtZero: true,
			ticks: {callback: function(value, index, values) {return value + "%";}}
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
			const yearlyAverages = {
			1996: 6.23,	2000: 6.7, 2003: 7.58, 2006: 7.87, 2008: 7.95, 2010: 8.15, 2012: 8.32, 2015: 8.7, 2017: 9.03, 2020: 12.41, 2022: 12.18
			};
			const currentAverage = yearlyAverages[feature.properties.Jaar];

			let average;
			if (feature.properties.Urban_Green_Perc >= currentAverage) {average = 'above';}
				 else {average = 'below';}
			let averageText;
			if (feature.properties.Urban_Green_Perc < currentAverage) {averageText = 'Consider creating more urban green areas to provide a green space for your residents.';}
				 else {averageText = 'Thank you for providing green spaces for your residents!';}

			const chartLayoutHTML = `
  				<div style="display: flex; flex-direction: column; height: 100%; gap: 0px; padding-right: 20px">
					
    				<div style="flex: 1; position: relative; min-height: 250px; margin-top: 0px; margin-bottom: 0px;">
      					<canvas id="barchart"></canvas>
    				</div>
    				<div style="flex: 1; position: relative; min-height: 250px; margin-bottom: 0px;">
     					<canvas id="linechart"></canvas>
    				</div>
						  				
					</div> `;

			topsidebarContent.innerHTML = `<p style="margin-top: 0px; margin-bottom: 0px; margin-right: 0px">${feature.properties.statnaam}</p>
			<p id='topsidebar-content' style="margin-top: 7px; margin-bottom: 0px; margin-left: 20px; font-size: 13.5px; font-weight: 500; font-style: italic; text-align: justify;">Hover over the graphs to see more details on the Urban Green to Residential Ratio or the UGP.</p>`;
			
			bottomsidebarContent.innerHTML = `<div id='bottomsidebar-content' style="margin-top: 0px; margin-left: 15px; font-size: 14px; font-weight: 600;">${feature.properties.statnaam}'s UGP is ${average} average in ${feature.properties.Jaar}.</div>
			<div id='bottomsidebar-content' style="margin-top: 0px; margin-left: 15px; font-size: 14px; font-weight: 500; text-align: justify;">${averageText}</div>`
			
			if (!document.getElementById('barchart') || !document.getElementById('linechart')) {
        	sidebarContent.innerHTML = chartLayoutHTML;
        	barChart = null; lineChart = null;}

      		renderOrUpdateChart(statnaam);			
			map.fitBounds(e.target.getBounds(),{ animate: true});
		} 
	});

	
}

map.attributionControl.addAttribution('Data &copy; <a href="https://opendata.cbs.nl/">Centraal Bureau voor de Statistiek</a>');

const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	const div = L.DomUtil.create('div', 'info legend');
	const grades = ['na', 0, 5, 7.5, 10, 12.5, 15];
	const labels = [];
	let from, to;

	for (let i = 0; i < grades.length; i++) {
		from = grades[i];
		from_text = ['na','0&ndash;5%','5&ndash;7.5%','7.5&ndash;10%','10&ndash;12.5%', '12.5&ndash;15%','15%+',];
		to = grades[i + 1];
		labels.push(`<i style="background:${getColor(from+0.01)}"></i> ${from_text[i]}`);
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

legend.addTo(map);



var searchControl = new L.Control.Search({
		layer: geojson2022,
		propertyName: 'statnaam',
		marker: false,
		moveToLocation: function(latlng, title, map) {
			var zoom = map.getBoundsZoom(latlng.layer.getBounds());
  			map.setView(latlng, zoom);
		}
	});

	searchControl.on('search:locationfound', function(e) {
		if(e.layer._popup)
			e.layer.openPopup();

	}).on('search:collapsed', function(e) {

		geojson2022.eachLayer(function(layer) {	
			geojson2022.resetStyle(layer);
		});	
	});
	
	map.addControl( searchControl ); 

	layerGroup = L.layerGroup([geojson1996, geojson2000, geojson2003, geojson2006, geojson2008, geojson2010, geojson2012, geojson2015, geojson2017, geojson2020, geojson2022]);
	var sliderControl = new L.Control.SliderControl({
  		layer: layerGroup,
		follow: 1,
		showAllOnStart: true
	});

	map.addControl(sliderControl);
	sliderControl.startSlider();