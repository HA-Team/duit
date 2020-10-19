app.service('tokkoApi', ['$http', function($http) {
  const baseUrl = 'https://tokkobroker.com/api/v1/';
  const tokkoAuth = {
    key: 'f26431aec0277d4e7912e2709af35707fb9362e6',
    lang: 'es_ar'
  };

  return {
    find: (endpoint, args, timeout) => {
      let url = `${baseUrl}${endpoint}/?format=json&`;

      if (typeof args == 'object') {
        for (let arg in args) {
          url += `${arg}=${args[arg]}&`
        };
      } else url += `id=${args}&`;

      return $http({method: 'GET', url: `${url}key=${tokkoAuth.key}&lang=${tokkoAuth.lang}`, timeout: timeout.promise});
    },
    insert: function (endpoint, data, callback) {
      let http = new XMLHttpRequest(),
        url = `${baseUrl}${endpoint}/?key=${tokkoAuth.key}`,
        content = JSON.stringify(data);

      http.open("POST", url, true);

      //Send the proper header information along with the request
      http.setRequestHeader("Content-type", "application/json");

      http.onreadystatechange = function() {
        //Call a function when the state changes.
        if(http.readyState == 4 && (http.status == 200 || http.status == 201)) callback({result: 'success', status: http.status});
        else callback({result: 'error', status: http.status, result: http.responseText});
      };

      http.send(content);
    }
  };
}]);