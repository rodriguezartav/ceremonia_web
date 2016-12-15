var request = require("superagent");
var Global = require("../global");
var EventEmitter = require("events");
var PGHelper = require('./pgHelper');

var Trabajos = new EventEmitter();

Trabajos.crear = function( user, form_data ){
  form_data.userId = user.current.sfid;
  request.post(Global.PUBLIC_API_URL)
  .send( JSON.stringify( { action: "TRABAJO_SOLDADOR_CREAR", body: formData } ) )
  .set('Content-Type', 'text/plain')
  .end( function(err,res){
    if( err || !res.ok || res.text.indexOf("errorCode") > -1) return User.generateCreateError(err,res);
    var soldador = res.body;

  })
}

Trabajos.generateCreateError = function(err, res){
  console.log(err);
  var parsedError;
  if( err ) parsedError = {type: "HTTP_ERROR", errorCode: "-1", userMessage: "Internet Error", message: err.toString(), stack: ""}
  else{
    parsedError = JSON.parse(res.text);
    parsedError.userMessage = "No lo pudimos crear, lo sentimos.";
  }

  //if( parsedError.message.indexOf("DUPLICATE_VALUE") > -1 ) User.checkIfExists();
  //else User.emit('CREATE_ERROR', parsedError);
}

module.exports = Trabajos;
