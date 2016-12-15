var request = require("superagent");
var Global = require("../global");
var EventEmitter = require("events");
var PGHelper = require('./pgHelper');

window.fbAsyncInit = function(){
  FB.init({
    appId      : process.env.FACEBOOK_APP_ID,
    xfbml      : true,
    version    : 'v2.8',
    status     : true
  });

  FB.getLoginStatus(function(response) {
    User.processStatus(response);
  });
}

var User = new EventEmitter();

User.facebookStatus = "not_connected";
User.salesforceStatus = 'checking'

User.current = null;
//See fbStatus reference below
User.processStatus = function(fbStatus){
  if( fbStatus.status != 'connected' ) fbStatus.status = 'not_connected';
  else{
    if( !User.current ) User.current = {};
    User.current.facebook_authtoken__c = fbStatus.authResponse;
    User.checkIfExists();
  }

  if( fbStatus.status != User.facebookStatus ){
    User.facebookStatus = fbStatus.status;
    User.emit('FACEBOOK_STATUS_CHANGED');
  }
}

User.checkIfExists = function(){
  request.get(Global.API_URL)
  .query("query=select id, nombre__c, ubicacion__c, sfid, nacimiento__c, foto_perfil__c,email__c from salesforce.soldadores__c where facebook_userid__c = '" + User.current.facebook_authtoken__c.userID + "'")
  .end( function(err,res){
    if( err || !res.ok || res.text.indexOf("error") > -1) return User.generateLoginError(err,res);

    var response = JSON.parse(res.body);
    var rows = PGHelper.parseQuery(response);
    if( rows.length > 0 ){
      var row = rows[0];
      for (var attrname in row) User.current[attrname] = row[attrname];
      User.salesforceStatus = 'registered';
    }
    else{
      User.getFacebookData();
      User.salesforceStatus = 'not_registered';
    }
    User.emit('SALESFORCE_STATUS_CHANGED');
  })
}

User.getFacebookData = function(){
  FB.api('/me?fields=email,name,cover,birthday,hometown,location,about,picture', function(response) {
    console.log(response);
    //soldador.Nacimiento__c = new Date(User.current.birthday);
    User.current.facebook_userid__c = response.id;
    User.current.email__c = response.email;
    User.current.nombre__c = response.name;
    if( response.picture) User.current.foto_perfil__c = response.picture.data.url;
    if( response.location ) User.current.ubicacion__c = response.location.name;
    if( response.location && !User.current.ubicacion__c ) User.current.ubicacion__c = response.hometown.name;
    if(User.isInfoComplete) User.register();
    else User.emit("REGISTER_NEED_INFO");
  });
}

User.isInfoComplete = function(){
  var complete = true;
  if( !User.current.email__c ) complete = false;
  if( !User.current.nombre__c ) complete = false;
  return complete;
}

User.register = function( form_data ){
  if( form_data ) User.current.email__c = form_data.email__c;
  request.post(Global.PUBLIC_API_URL)
  .send( JSON.stringify( {action: "SOLDADOR_CREAR", body: User.current} ) )
  .set('Content-Type', 'text/plain')
  .end( function(err,res){
    if( err || !res.ok || res.text.indexOf("errorCode") > -1) return User.generateRegisterError(err,res);
    var soldador = res.body;
    if( soldador ){
      for (var attrname in soldador) User.current[attrname] = soldador[attrname];
      User.salesforceStatus = 'registered';
      User.emit('SALESFORCE_STATUS_CHANGED');
    }
  })
}

User.update = function( soldador ){
  request.post(Global.PUBLIC_API_URL)
  .send( JSON.stringify( {action: "SOLDADOR_UPDATE", body: soldador} ) )
  .set('Content-Type', 'text/plain')
  .end( function(err,res){
    if( err || !res.ok || res.text.indexOf("errorCode") > -1) return User.generateRegisterError(err,res);
    var soldador = JSON.parse(res.body);
    if( soldador ){
      for (var attrname in soldador) User.current[attrname] = soldador[attrname];
      User.salesforceStatus = 'registered';
      User.emit('SALESFORCE_STATUS_CHANGED');
    }
  })
}

User.generateRegisterError = function(err, res){
  console.log(err);
  var parsedError;
  if( err ) parsedError = {type: "HTTP_ERROR", errorCode: "-1", userMessage: "Internet Error", message: err.toString(), stack: ""}
  else{
    parsedError = JSON.parse(res.text);
    parsedError.userMessage = "No lo pudimos registrar, lo sentimos.";
  }

  if( parsedError.message.indexOf("DUPLICATE_VALUE") > -1 ) User.checkIfExists();
  else User.emit('REGISTER_ERROR', parsedError);
}

User.generateLoginError = function(err, res){
  console.log(err);
  var parsedError;
  if( err ) parsedError = {type: "HTTP_ERROR", errorCode: "-1", message: err.toString(), stack: ""}
  else parsedError = JSON.parse(res.text);

  if( parsedError.message.indexOf("DUPLICATE_VALUE") > -1 ) User.checkIfExists();
  else User.emit('LOGIN_ERROR', parsedError);
}

User.login = function(){
  FB.login( User.handleLoginResponse, {scope: 'email,user_about_me,user_birthday,user_hometown,user_location'} );
}

User.handleLoginResponse = function(response){
  User.processStatus( response );
}

User.logout = function(){
  FB.logout(User.handleLoginResponse);
}

module.exports = User;

/*
{
    status: 'connected',
    authResponse: {
        accessToken: '...',
        expiresIn:'...',
        signedRequest:'...',
        userID:'...'
    }
}

connected. The person is logged into Facebook, and has logged into your app.
not_authorized. The person is logged into Facebook, but has not logged into your app.
unknown. The person is not logged into Facebook, so you don't know if they've logged into your app. Or FB.logout() was called before and therefore, it cannot connect to Facebook.
authResponse is included if the status is connected and is made up of the following:
accessToken. Contains an access token for the person using the app.
expiresIn. Indicates the UNIX time when the token expires and needs to be renewed.
signedRequest. A signed parameter that contains information about the person using the app.
userID is the ID of the person using the app.

*/
