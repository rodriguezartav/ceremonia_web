var React         = require("react");

var request = require("superagent");
var API_URL = " https://exf6u2y11h.execute-api.us-east-1.amazonaws.com/v1";
var q = require("kew");


function Business(app){
  this.app = app;
  this.load()
  Business.instance = this;
}

Business.prototype.load = function(){
  var _this = this;
  request.get(API_URL)
  .send()
  .end( function(err,res){
    _this.app.setState({ items: res.body.items, summary: res.body.count })
  })
}


Business.prototype.createRecord = function(record){
  var _this = this;

  return this.createRecordAPI(record)
  .then( function(res){
    if( !res.body.success && res.body.code == 1 ) return _this.setError( <div><strong>Los sentimos parece que ya existe una reservacion con estos datos.</strong> No se preocupe para resolver el problem simplemente envile un correo a Carolina con sus datos y lo que le gustaria cambiar.</div>);
    _this.app.setState({view: "reserveConfirmation", record: record})
    return _this.state.business.load();
  })
  .fail( function(err){
    if( err.code == 1 ) _this.setError( <div><strong>Los sentimos parece que ya existe una reservacion con estos datos.</strong> Para resolver el problem simplemente de click en Preguntas en la parte superior.</div>);
    else if(err.message && err.message.indexOf("Bad Request") ) _this.setError( <div><strong>Informacion incorrecta</strong> Revise que el email y numero de telefono esten correctos</div>);
    else if(err.message) _this.setError( <div>{err.message}</div> );
    else _this.setError( <div>Ocurrio un error de internet. Favor intent de nuevo o envienos esta informacion: { JSON.stringify(err) }</div> );
  })
}

Business.prototype.createRecordAPI = function(body){
  var defer = q.defer();
console.log(body)
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

Business.prototype.onChangeView = function(view){
  this.app.setState({view: view});
}

Business.prototype.setError = function(text){
  this.app.setState({reserveError: true, reserveErrorText: text});
}


module.exports = Business
