Dropbox = {};

// Request Dropbox credentials for the user
//
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Dropbox.requestCredential = function(options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'dropbox'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError());
    return;
  }

  var credentialToken = Random.secret();

  var loginStyle = OAuth._loginStyle('dropbox', config, options);

  var loginUrl =
    'https://www.dropbox.com/1/oauth2/authorize?client_id=' + config.appKey +
    '&redirect_uri=' + OAuth._redirectUri('dropbox', config) +
    '&response_type=code' +
    '&state=' + OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl);

  OAuth.launchLogin({
    loginService: "dropbox",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
};
