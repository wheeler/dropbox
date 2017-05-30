Package.describe({
  name: 'wheeler:dropbox',
  version: '1.0.0',
  summary: 'Dropbox OAuth flow',
  git: 'https://github.com/meteor-helium/dropbox.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom("METEOR@1.2.0.2");
  
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Dropbox');

  api.addFiles(
    ['dropbox_configure.html', 'dropbox_configure.js'],
    'client');

  api.addFiles('dropbox_server.js', 'server');
  api.addFiles('dropbox_client.js', 'client');
});
