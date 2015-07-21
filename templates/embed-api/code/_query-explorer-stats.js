gapi.analytics.ready(function() {

  var query = {
    ids: 'ga:87553310',
    'start-date': '2daysAgo',
    'end-date': 'yesterday',
    metrics: 'ga:metric1',
    dimensions: 'ga:dimension2',
    filters: 'ga:dimension2=@ids'
  };

  getFullQueryResults(query).then(function(rows) {

    var dimensionMap = {
      ids: 0,
      'start-date': 0,
      'end-date': 0,
      metrics: 0,
      dimensions: 0,
      sort: 0,
      filters: 0,
      segment: 0,
      samplingLevel: 0,
      'start-index': 0,
      'max-results': 0
    };

    rows.forEach(function(row) {

      var dimensions = row[0].split('&').map(function(value) {
        return value.replace(/=.*$/, '')
      });

      dimensions.forEach(function(dimension) {
        dimensionMap[dimension]++;
      });
    });

    dimensionsPreference = Object.keys(dimensionMap).map(function(key) {
      return {
        name: key,
        count: dimensionMap[key]
      };
    })
    .sort(function(a, b) {
      return b.count - a.count;
    });

    dimensionsPreference.forEach(function(dimension) {
      console.log(dimension.name, dimension.count)
    });
  })
  .catch(console.error.bind(console));

});


function getFullQueryResults(query) {
  query['start-index'] = 1;
  query['max-results'] = 10000;

  return new Promise(function(resolve, reject) {
    var data = new gapi.analytics.report.Data({query: query});
    var rows = [];
    var startIndex = 1;

    data.on('error', reject);
    data.on('success', function(response) {
      rows = rows.concat(response.rows);
      if (startIndex + response.itemsPerPage < response.totalResults) {
        startIndex += response.itemsPerPage;
        data.set({query: {'start-index': startIndex}}).execute();
      } else {
        resolve(rows);
      }
    });

    data.execute();
  });
}
