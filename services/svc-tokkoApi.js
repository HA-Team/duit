app.service('tokkoApi', function() {
  const baseUrl = 'https://tokkobroker.com/api/v1/';
  const tokkoAuth = {
    key: 'f26431aec0277d4e7912e2709af35707fb9362e6',
    lang: 'es_ar'
  };

  const httpGetAsync = function (url, callback) {
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = () => { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.responseText);
    };

    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
  };

  return {
    find: function (endpoint, args, callback) {
      let url = `${baseUrl}${endpoint}/?format=json&`;

      if (typeof args == 'object') {
        for (let arg in args) {
          url += `${arg}=${args[arg]}&`
        };
      } else url += `id=${args}&`;

      httpGetAsync(`${url}key=${tokkoAuth.key}&lang=${tokkoAuth.lang}`, (response) => {
        if (endpoint === 'property/get_search_summary') callback(JSON.parse(response));
        else callback(JSON.parse(response).objects);
      });
    },
    findOne: function (endpoint, args, callback) {
      this.find(endpoint, args, (response) => callback(response[0]));
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
});