  // const ctx = document.getElementById('barchart');

  // new Chart(ctx, {
  //   type: 'bar',
  //   data: {
  //     labels: ['1996', '2000', '2003', '2006', '2008', '2010', '2012', '2015', '2017', '2020', '2022'],
  //     datasets: [{
  //       label: 'Residential (ha)',
  //       data: [484, 495, 489, 485, 487, 491, 490, 494, 514, 540, 547],
  //       borderWidth: 1,
  //       backgroundColor: '#99a194'
  //     },
  //   {
  //       label: 'Urban Green (ha)',
  //       data: [29, 29, 32, 35, 35, 36, 41, 41, 46, 57, 49],
  //       borderWidth: 1,
  //       backgroundColor: '#72a155'
  //     }]
  //   },
  //   options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       layout: {
  //           padding: 20
  //       },
  //     scales: {
  //       x: {
  //           stacked: true
  //       },
  //       y: {
  //           stacked: true,
  //           beginAtZero: true
  //       }
  //     }
  //   }
  // });

  // const ctx1 = document.getElementById('linechart');

  // new Chart(ctx1, {
  //   type: 'line',
  //   data: {
  //     labels: ['1996', '2000', '2003', '2006', '2008', '2010', '2012', '2015', '2017', '2020', '2022'],
  //     datasets: [
  //   {
  //       label: 'Urban Green (ha)',
  //       data: [29/484, 29/495, 32/489, 35/485, 35/487, 36/491, 41/490, 41/494, 46/514, 57/540, 49/547],
  //       borderWidth: 5,
  //       backgroundColor: '#72a155',
  //       borderColor: '#72a155'
  //     },
  //   {
  //       label: 'Province Average (dummy data)',
  //       data: [0.06, 0.06, 0.07, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.09, 0.09],
  //       borderWidth: 2,
  //       backgroundColor: '#8aa679',
  //       borderColor: '#8aa679',
  //       borderDash: [5, 5]
  //     },
  //     {
  //       label: 'Country Average (dummy data)',
  //       data: [0.04, 0.05, 0.05, 0.06, 0.06, 0.06, 0.07, 0.07, 0.07, 0.07, 0.08],
  //       borderWidth: 2,
  //       backgroundColor: '#a8b3a2',
  //       borderColor: '#a8b3a2'
  //     }
  //   ]
  //   },
  //   options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       layout: {
  //           padding: 20
  //       },
  //     scales: {
  //       x: {
  //           stacked: false
  //       },
  //       y: {
  //           stacked: false,
  //           beginAtZero: true
  //       }
  //     }
  //   }
  // });

//   function getGreenByName(geoJson, targetName) {
//   const features = geoJson.features || [];
//   const years = features
//     .filter(feature => feature.properties?.statnaam === targetName)
//     .map(feature => feature.properties?.Urban_Green_Perc)
//     .filter(year => year !== undefined && year !== null);

//   return [...new Set(years)];
// }

// function getGreyByName(geoJson, targetName) {
//   const features = geoJson.features || [];
//   const years = features
//     .filter(feature => feature.properties?.statnaam === targetName)
//     .map(feature => feature.properties?.Residential_Perc)
//     .filter(year => year !== undefined && year !== null);

//   return [...new Set(years)];
// }

// function getYearByName(geoJson, targetName) {
//   const features = geoJson.features || [];
//   const years = features
//     .filter(feature => feature.properties?.statnaam === targetName)
//     .map(feature => feature.properties?.Jaar)
//     .filter(year => year !== undefined && year !== null);

//   return [...new Set(years)];
// }

// const green = getGreenByName(dataAll, 'Zeewolde');
// document.getElementById('output').textContent = JSON.stringify(green)

// const grey = getGreyByName(dataAll, 'Zeewolde');
// document.getElementById('output1').textContent = JSON.stringify(grey)

// const year = getYearByName(dataAll, 'Zeewolde');
// document.getElementById('output2').textContent = JSON.stringify(year)

// const ctx = document.getElementById('barchart');

// new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: year,
//       datasets: [{
//         label: 'Residential',
//         data: grey,
//         borderWidth: 1,
//         backgroundColor: '#99a194'
//       },
//     {
//         label: 'Urban Green',
//         data: green,
//         borderWidth: 1,
//         backgroundColor: '#72a155'
//       }]
//     },
//     options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         layout: {
//             padding: 20
//         },
//       scales: {
//         x: {
//             stacked: true
//         },
//         y: {
//             stacked: true,
//             beginAtZero: true
//         }
//       }
//     }
//   });

function chartMunicipality(targetName) {
  const features = dataAll.features || [];
  const green_features = features
    .filter(feature => feature.properties?.statnaam === targetName)
    .map(feature => feature.properties?.Urban_Green_Perc)
    .filter(year => year !== undefined && year !== null);
  const green_array = [...new Set(green_features)];

  const grey_features = features
    .filter(feature => feature.properties?.statnaam === targetName)
    .map(feature => feature.properties?.Residential_Perc)
    .filter(year => year !== undefined && year !== null);
  const grey_array = [...new Set(grey_features)];

  const year_features = features
    .filter(feature => feature.properties?.statnaam === targetName)
    .map(feature => feature.properties?.Jaar)
    .filter(year => year !== undefined && year !== null);
  const year_array = [...new Set(year_features)];

 return [green_array, grey_array, year_array]; 

}

let [green_array, grey_array, year_array] = chartMunicipality('Zeewolde');
const ctx = document.getElementById('barchart');

  new Chart(ctx, {
    type: 'bar',
    data: { 
      labels: year_array,
      datasets: [{
        label: 'Residential',
        data: grey_array,
        borderWidth: 1,
        backgroundColor: '#99a194' },
    {
        label: 'Urban Green',
        data: green_array,
        borderWidth: 1,
        backgroundColor: '#72a155' }]},
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 20 },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }}}});

