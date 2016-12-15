var React = require("react");
var User  = require("../models/user");

var ListSoldadores =  React.createClass({

  renderSoldadores: function(){
    var _this = this;
    return this.props.soldadores.map( function(soldador){
      return _this.renderSoldador(soldador);
    })
  },

  renderSoldador: function(soldador){
    console.log( soldador)
    var image = "https://graph.facebook.com/"+soldador.facebook_userid__c+"/picture?width=356&height=280"
    return <div className="card" key={soldador.sfid}>
      <img src={image} style={{float: "left", width: "100%", height: 280}} />
      <div className="card-text">
        <p>Nombre {soldador.nombre__c}</p>
        <p>Email {soldador.email__c}</p>
        <p>Ubicacion {soldador.ubicacion__c}</p>
      </div>

    </div>
  },

  render: function(){
    return <div className="album text-muted">
      <div className="container">
        <div className="row">
          { this.renderSoldadores() }
        </div>
      </div>
    </div>
  }

})

module.exports = ListSoldadores;
