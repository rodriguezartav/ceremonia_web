var request = require("superagent");
var Global = require("../global");
var EventEmitter = require("events");
var PGHelper = require('./pgHelper');

var Soldadores = new EventEmitter();


Soldadores.getRecent = function(){

  request.get(Global.API_URL)

  .query("query=select nombre__c, Ubicacion__c, sfid, Nacimiento__c,Facebook_UserId__c, Foto_Perfil__c,Email__c from Salesforce.Soldadores__c where Active__c = true order by LastModifiedDate desc  limit 20")
  .end( function(err,res){
    var rows = PGHelper.parseQuery( JSON.parse(res.body) );
    Soldadores.emit("REFRESH",rows);
  })

}

module.exports = Soldadores;
