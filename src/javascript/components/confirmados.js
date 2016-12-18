var React         = require("react");
var Business = require("../business");

var Confirmados =  React.createClass({

  getForDay: function(dias, day){
    var itemForDay;
    if( dias[day].length == 0 ) return null;
    else{
      var item = dias[day].pop()

      return <div>
        <h4 className="card-title">{item.celular}</h4>
        { item.depositado > 0 ? <small>Confirmado</small> : <strong>Falta Deposito</strong> }
      </div>

    }
  },

  renderItems: function(){
    var items = this.props.items;
    var dias = { jueves: [], sabado: [], domingo: []}
    items.forEach( function(item){
      if( item.jueves ) dias.jueves.push(item);
      if( item.sabado ) dias.sabado.push(item);
      if( item.domingo ) dias.domingo.push(item);
    })

    dias.jueves.sort()
    dias.sabado.sort()
    dias.domingo.sort()

    var renderedItems = []
    while(dias.jueves.length > 0 || dias.sabado.length > 0 || dias.domingo.length > 0) renderedItems.push( this.renderRow(dias) );
    return renderedItems;
  },

  renderRow: function(dias){
    return  <div key={Math.random()} className="row">
        <div className="col-xs-4 col-sm-4">
          <div className="card">
            <div className="card-block">
               { this.getForDay(dias, "jueves") }
            </div>
          </div>

        </div>
        <div className="col-xs-4 col-sm-4">
          <div className="card">
            <div className="card-block">
              { this.getForDay(dias, "sabado") }
            </div>
          </div>
        </div>
        <div className="col-xs-4 col-sm-4">
          <div className="card">
            <div className="card-block">
              { this.getForDay(dias, "domingo") }
            </div>
          </div>
        </div>
      </div>
  },


 render: function(){
  return <div class="">

    <div className="container">

      <div className="row">
        <div className="col-xs-4 col-sm-4">
          <div className="card card-inverse card-primary">
            <div className="card-block">
              <h4 className="card-title">Jueves</h4>
            </div>
          </div>

        </div>
        <div className="col-xs-4 col-sm-4">
          <div  className="card card-inverse card-primary">
            <div className="card-block">
              <h4 className="card-title active">Sabado</h4>
            </div>
          </div>
        </div>
        <div className="col-xs-4 col-sm-4">
          <div  className="card card-inverse card-primary">
            <div className="card-block">
              <h4 className="card-title">Domingo</h4>
            </div>
          </div>
        </div>
      </div>

      { this.renderItems() }

    </div>

  </div>

 }

})

function replaceAll(target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement);
}

module.exports = Confirmados;
