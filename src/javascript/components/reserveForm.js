var React         = require("react");
var Business = require("../business");

var Confirmados = require("./confirmados")

var Home =  React.createClass({

  getInitialState: function(){
    return {
      btnSabado: false,
      btnDomingo: false,
      btnJueves: false,
      reserveError: false,
      reserveErrorText: "",
      personas: 1,
      celPhoneError: ""
    }
  },

  componentWillReceiveProps: function(nextProps){
    if( nextProps.reserveError ){
      this.setState({ reserveErrorText: nextProps.reserveErrorText, reserveError: nextProps.reserveError })
    }
  },

  onChangePersonas: function(e){
    //var personas = parseInt( e.currentTarget.value );
    this.setState({personas: e.currentTarget.value})
  },

  onDayClick: function(e){
    var day = e.currentTarget.dataset.day;

    var cantidad = this.props.summary[day];
    if( day == "sabado" && cantidad > 3 ){
      alert("Lo sentimos, este dia ya esta lleno...");
      return;
    }

    if( day == "jueves" && !this.state.btnJueves) this.setState({btnJueves: true})
    else if( day == "jueves" && this.state.btnJueves) this.setState({btnJueves: false})

    else if( day == "sabado" && !this.state.btnSabado) this.setState({btnSabado: true})
    else if( day == "sabado" && this.state.btnSabado) this.setState({btnSabado: false})

    else if( day == "domingo" && !this.state.btnDomingo) this.setState({btnDomingo: true})
    else if( day == "domingo" && this.state.btnDomingo) this.setState({btnDomingo: false})
  },

  getClassDay: function(day){
    if(this.state.btnJueves && day == "jueves") return " btn btn-success";
    else if(this.state.btnSabado && day == "sabado") return " btn btn-success";
    else if(this.state.btnDomingo && day == "domingo") return " btn btn-success";
    else return "btn btn-secondary";
  },

  onMakeReservation: function(){
    var _this = this;

    function validateInput(input){
      if( input.value == ""  || !input.value) return false;
      return true;
    }

    function validateInputTelefono(input){
      var value = input.value;
      if( value == ""  || !value) return false;

      value = replaceAll(value," ", "");
      value = replaceAll(value, "-", "");
      value = parseInt(value);
      if( !value || value == NaN || value < 0 ) return false;
      input.value = value;
      if( value < 20000000 || value > 90000000 ) return false;
      return true;
    }

    function validateInputEmail(input){
      var value = input.value;
      if( value == ""  || !value) return false;
      if( value.indexOf("@") == -1 ) return false;
      if( value.indexOf(".") == -1 ) return false;
      if(value.length < 4) return false;
      return true;
    }

    function validateDays(){
      if( !_this.state.btnDomingo && !+ _this.state.btnSabado && !_this.state.btnJueves ) return false;
      return true;
    }

    if( parseInt(this.state.personas) > 0 && !validateInput(this.refs.txt_nombre) || !validateInputEmail(this.refs.txt_email) || !validateDays() ){
      return this.setState({reserveError: true, reserveErrorText: <div><strong>Los sentimos</strong> necesitamos que revise lo siguiente:<ul><li>Todos los espacios esten completos</li><li>Haya escogido los dias que quiere ir y esten marcados en verde.</li><li>El email debe ser valido</li><li>El telefono solo debe tener numeros, sin espacios</li><li>El numero de personas debe ser un numero mayor que 0</li></ul></div>})
    }

    if( !validateInputTelefono(this.refs.txt_celular) ){
      return this.setState({ celPhoneError: "Revise el telefono", reserveError: true, reserveErrorText: <div><strong>Los sentimos</strong> necesitamos que revise lo siguiente: El telefono debe tener 8 digitos y ser valido.</div>})
    }

    this.setState({procesing: true, celPhoneError: "", reserveErrorText: "", reserveError: false });
    var record = {
      nombre: this.refs.txt_nombre.value,
      email: this.refs.txt_email.value,
      celular: parseInt(this.refs.txt_celular.value),
      jueves: this.state.btnJueves && this.state.personas ? this.state.personas : 0 ,
      sabado: this.state.btnSabado && this.state.personas ? this.state.personas : 0,
      domingo: this.state.btnDomingo && this.state.personas ? this.state.personas : 0,
    }
    this.setMonto(record);

    Business.instance.createRecord(record)
    .then( function(){ _this.setState({procesing: false }) } )
    .done()
  },

  setMonto: function(record){
    var monto = 0;
    var dias = 0;
    var personas = 0;
    if( record.jueves ){
      personas =record.jueves
      dias++;
    }
    if( record.sabado ){
     personas = record.juevsabadoes;
      dias++;
    }
    if( record.domingo ){
      personas = record.domingo;
      dias++;
    }
    if( dias == 1) monto = 150 * personas;
    if( dias == 2) monto = 300 * personas;
    if( dias == 3) monto = 500 * personas;
    record.monto = monto;
  },

  renderSubmit: function(){
    if( this.state.procesing ){
      return <button disabled style={{marginTop: 10 }} type="submit" className="btn btn-primary ">Un Momento...</button>
    }
    return <button onClick={this.onMakeReservation} style={{marginTop: 10 }} type="submit" className="btn btn-primary ">Reservar</button>

  },

  renderReserveError: function(){
    if( !this.state.reserveError) return null;
    return <div style={{margin: 10}} className="alert alert-danger" role="alert">
      { this.state.reserveErrorText }
    </div>
  },

 render: function(){
  return <div class="">

    <div className="col-md-5">
     <h4 className="">Reserve su espacio</h4>
     <p>Complete todos los datos y de click en Reservar.</p>

      <div className="form-group row">
        <label for="example-text-input" className="col-xs-12 col-sm-2 col-form-label">Nombre</label>
        <div className="col-xs-12 col-sm-10">
          <input ref="txt_nombre" className="form-control" type="text" />
        </div>
      </div>
      <div className="form-group row">
        <label for="example-search-input" className="col-xs-12 col-sm-2 col-form-label">Email</label>
        <div className="col-xs-12 col-sm-10">
          <input  ref="txt_email" className="form-control" type="email" />
        </div>
      </div>
      <div className="form-group row">
        <label for="example-search-input" className="col-xs-12 col-sm-2 col-form-label">Celular</label>
        <div className="col-xs-12 col-sm-10">
          <input  ref="txt_celular" className="form-control" type="text" />
          <p style={{color: "red"}}>{this.state.celPhoneError}</p>
        </div>
      </div>

      <div className="form-group row">
        <label for="example-search-input" className="col-xs-12 col-sm-2 col-form-label">Dias</label>
        <div className="col-xs-12 col-sm-10">
          <button data-day="jueves" onClick={this.onDayClick} style={{marginRight: 5}} className={this.getClassDay('jueves')}>Jueves</button>
          <button data-day="sabado" onClick={this.onDayClick} style={{marginRight: 5}} className={this.getClassDay('sabado')}>Sabado</button>
          <button data-day="domingo" onClick={this.onDayClick} style={{marginRight: 5}} className={this.getClassDay('domingo')}>Domingo</button>
        </div>
      </div>

      <div className="form-group row">
        <label for="example-search-input" className="col-xs-12 col-sm-2 col-form-label">Personas</label>
        <div className="col-xs-12 col-sm-10">
          <input value={this.state.personas} onChange={this.onChangePersonas} ref="txt_personas" className="form-control" type="number" />
          <small>Si esta reservando y depositando para varias personas ingrese aqui el numero</small>
        </div>
      </div>

        {this.renderReserveError()}

        {this.renderSubmit()}

        <p className="small">La reservacion no se podra aplicar hasta realizado el deposito. Le enviaremos las instrucciones del deposito a su correo.</p>

      <div style={{clear: "both"}} className=""></div>

    </div>

  </div>

 }

})

function replaceAll(target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement);
}

module.exports = Home;
