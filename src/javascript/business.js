var request = require("superagent");
var API_URL = " https://exf6u2y11h.execute-api.us-east-1.amazonaws.com/v1";
var q = require("kew");

function Business(app){
  this.app = app;
}

Business.prototype.createRecord = function(body){
  var defer = q.defer();

  request.post(API_URL)
  .set("Content-Type","application/json")
  .send(body)
  .end( function(err,res){
    if(err) return defer.reject(err)
    else if(!res.ok) return defer.reject(res.body);
    else if(!res.body.success) return defer.reject(res.body);
    else return defer.resolve(res)
  })

  return defer.promise;
}

module.exports = Business
