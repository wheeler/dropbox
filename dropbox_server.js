Dropbox = {};


OAuth.registerService('dropbox', 2, null, function(query) {

  var response = getTokenResponse(query);
  var accessToken = response.accessToken;
  var uid = response.uid;

  // include all fields from Dropbox
  var whitelisted = ['account_id', 'name', 'email', 'email_verified',
      'locale', 'referral_link', 'is_paired', 'account_type', 'country',
    'team', 'team_member_id', 'profile_photo_url'];

  var identity = getIdentity(accessToken);
  if (identity.account_type && identity.account_type['.tag']) {
    identity.account_type = {tag: identity.account_type['.tag']}; // ".tag" not suitable for storage in MongoDB
  }

  var serviceData = {
    id: uid,
    accessToken: accessToken,
    // Dropbox accessToken never expires. It becomes invalid only when revoked by user.
    // Set this value to a long time in future. (10 years maybe?)
    expiresAt: (+new Date) + (1000 * 60 * 60 * 24 * 365 * 10)
  };


  var fields = _.pick(identity, whitelisted);
  _.extend(serviceData, fields);

  return {
    serviceData: serviceData,
    options: {profile: {name: identity.name.display_name}}
  };
});


// returns an object containing:
// - accessToken
// - tokenType
// - uid (Dropbox user ID)
var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'dropbox'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var responseContent;
  try {
    // Request an access token
    responseContent = HTTP.post(
      "https://api.dropboxapi.com/oauth2/token", {
        params: {
          code: query.code,
          grant_type: 'authorization_code',
          client_id: config.appKey,
          client_secret: OAuth.openSecret(config.appSecret),
          redirect_uri: OAuth._redirectUri('dropbox', config)
        }
      }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Dropbox. " + err.message),
      {response: err.response});
  }

  // Success!
  return {
    accessToken: responseContent.access_token,
    tokenType: responseContent.token_type,
    uid: responseContent.uid
  };
};

var getIdentity = function (accessToken) {
  try {
    return HTTP.post("https://api.dropboxapi.com/2/users/get_current_account", {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Dropbox. " + err.message),
      {response: err.response});
  }
};

Dropbox.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
