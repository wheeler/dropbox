Template.configureLoginServiceDialogForDropbox.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});

Template.configureLoginServiceDialogForDropbox.fields = function () {
  return [
    {property: 'appKey', label: 'App Key'},
    {property: 'appSecret', label: 'App Secret'}
  ];
};
