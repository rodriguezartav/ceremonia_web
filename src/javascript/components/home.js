var React         = require("react");
var Business = require("../business");
var ReserveForm = require("./reserveForm");
var Confirmados = require("./confirmados");
var ReserveConfirmation = require("./reserveConfirmation");
var Preguntas = require("./preguntas")
var Header = require("./header");

var Home =  React.createClass({

  getInitialState: function(){
    return {
      view: "reserve",
      items: [],
      reserveError: false,
      reserveErrorText: "",
      summary: {},
      record: {  }
    }
  },

  componentWillMount: function(){
    new Business(this);
  },


  renderConfirmados: function(){
    if( this.state.view != "confirmados" ) return null;
    return <Confirmados items={this.state.items }/>
  },

  renderReserveForm: function(){
    if( this.state.view != "reserve" ) return null;
    return <ReserveForm summary={this.state.summary} reserveError={this.state.reserveError} reserveErrorText={this.state.reserveErrorText} />
  },

  renderReserveConfirmation: function(){
    if( this.state.view != "reserveConfirmation" ) return null;
    return <ReserveConfirmation record={this.state.record} />
  },

  renderPreguntas: function(){
    if( this.state.view != "contacto" ) return null;
    return <Preguntas />
  },

 render: function(){
  return <div className="container">
    <Header view={this.state.view}/>

      { this.renderReserveForm() }
      { this.renderReserveConfirmation() }
      {this.renderConfirmados()}
      {this.renderPreguntas()}

  </div>

 }

})

function replaceAll(target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement);
}

module.exports = Home;
