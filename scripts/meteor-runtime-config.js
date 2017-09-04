__meteor_runtime_config__ = (() => {
  if (window.location.href.indexOf('localhost') === -1) {
    return {
      "meteorEnv": {NODE_ENV: 'production'},
      "DDP_DEFAULT_CONNECTION_URL": "http://backend.duitpropiedades.com.ar",
      "ROOT_URL": "http://duit.netlify.com",
    }
  } else {
    return {
      "meteorEnv": {NODE_ENV: 'development'},
      "DDP_DEFAULT_CONNECTION_URL": "http://localhost:3000",
      "ROOT_URL": "http://localhost:8080",
    }
  }
})();