var React         = require("react");
var Business = require("../business");

var Home =  React.createClass({

  getInitialState: function(){
    return {
      reserveForm: true,
      btnSabado: false,
      btnDomingo: false,
      btnJueves: false,
      reserveError: false,
      reserveErrorText: "",
      personas: 1,
      business: new Business(this)
    }
  },

  onChangePersonas: function(e){
    //var personas = parseInt( e.currentTarget.value );
    this.setState({personas: e.currentTarget.value})
  },

  onDayClick: function(e){
    var day = e.currentTarget.dataset.day;
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
    function validateDays(){
      if( !_this.state.btnDomingo && !+ _this.state.btnSabado && !_this.state.btnJueves ) return false;
      return true;
    }
    if( parseInt(this.state.personas) > 0 && !validateInput(this.refs.txt_nombre) || !validateInput(this.refs.txt_email) || !validateInput(this.refs.txt_celular) || !validateDays() ){
      return this.setState({reserveError: true, reserveErrorText: <div><strong>Los sentimos</strong> necesitamos que complete todos los espacios y escoja los dias que quiere participar.</div>})
    }

    this.state.business.createRecord({
      nombre: this.refs.txt_nombre.value,
      email: this.refs.txt_email.value,
      celular: this.refs.txt_celular.value,
      jueves: this.state.btnJueves && this.state.personas ? this.state.personas : 0 ,
      sabado: this.state.btnSabado && this.state.personas ? this.state.personas : 0,
      domingo: this.state.btnDomingo && this.state.personas ? this.state.personas : 0,
    })
    .then( function(res){
      _this.setState({reserveForm: false})
    })
    .fail( function(err){
      if( err.code == 1 ) _this.setState({reserveError: true, reserveErrorText: <div><strong>Los sentimos parece que ya existe una reservacion con estos datos.</strong> No se preocupe para resolver el problem simplemente envile un correo a Carolina con sus datos y lo que le gustaria cambiar.</div>})
      else if(err.message) _this.setState({reserveError: true, reserveErrorText: <div>{err.message}</div> })
      else _this.setState({reserveError: true, reserveErrorText: <div>Ocurrio un error de internet. Favor intent de nuevo o envienos esta informacion: { JSON.stringify(err) }</div> })

    }).done();
  },

  showReserveForm: function(){
    this.setState({ reserveForm: true })
  },

  render_reserveConfirmation: function(){
    if( this.state.reserveForm ) return null;
    return <div>
     <h1 className="">Gracias!</h1>
      <p className="">Le enviamos un correo con las instrucciones para depositar.</p>
      <p className="small">Luego de realizado el deposito revise su reservacion en la Lista de Confirmados</p>
    </div>
  },

  render_reserveError: function(){
    if( !this.state.reserveError) return null;
    return <div style={{margin: 10}} className="alert alert-danger" role="alert">
      { this.state.reserveErrorText }
    </div>
  },

  render_reserveForm: function(){
    if( !this.state.reserveForm ) return null;
    return <div className="col-md-5">
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

        {this.render_reserveError()}

        <button onClick={this.onMakeReservation} style={{marginTop: 10 }} type="submit" className="btn btn-primary ">Reservar</button>

        <p className="small">La reservacion no se podra aplicar hasta realizado el deposito. Le enviaremos las instrucciones del deposito a su correo.</p>

      <div style={{clear: "both"}} className=""></div>

    </div>
  },

 render: function(){
  return <div>

  <div className="jumbotron" style={{paddingBottom: 0}}>
    <h1 className="display-3">Hola!</h1>
    <p className="lead">Gracias por su interes en participar de la cermonia.</p>
    <hr className="my-2"/>

    { this.render_reserveForm() }
    { this.render_reserveConfirmation() }

    <hr className="my-2"/>

  </div>

    <div className="jumbotron" style={{paddingTop: 10}}>
      <h3 className="display-3">Lista de Confirmados</h3>
      <p className="lead">Aqui encontrara su codigo cuando haya hecho el deposito correctamente.</p>
      <p className="small">La informacion se actualiza al final del dia luego del corte de SINPE.</p>
    </div>

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

      <div className="row">
        <div className="col-xs-4 col-sm-4">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">7683</h4>
            </div>
          </div>

        </div>
        <div className="col-xs-4 col-sm-4">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">2222</h4>
            </div>
          </div>
        </div>
        <div className="col-xs-4 col-sm-4">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">21445</h4>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

 }

})


module.exports = Home;
