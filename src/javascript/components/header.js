var React         = require("react");
//var Trabajos = require("../models/trabajos");

var Soldadores = require("../models/soldadores");
var User = require("../models/user");
var Register = require("./register");
var ListSoldadores = require("./listSoldadores");

var Header =  React.createClass({

  getInitialState: function(){
    return {
      user: User.current,
      loginStatus: User.facebookStatus,
      registeredStatus: User.salesforceStatus,
      user_register_error: {},
      soldadores: [],
      showRegisterForm: false
    };
  },

  componentDidMount: function(){
    var _this = this;
    User.on("FACEBOOK_STATUS_CHANGED", function(){
      _this.setState({user: User.current, loginStatus: User.facebookStatus});
    })

    User.on("SALESFORCE_STATUS_CHANGED", function(){
      _this.setState({user: User.current, registeredStatus: User.salesforceStatus});
    })

    User.on("REGISTER_ERROR", function(err){
      _this.setState({user_register_error: err});
    })

    User.on("REGISTER_NEED_INFO", function(){
      _this.setState({showRegisterForm: true});
    })

    Soldadores.getRecent();

    Soldadores.on("REFRESH", function(soldadores){
      _this.setState({soldadores: soldadores});
    })
  },

  onLogout: function(){
    User.logout();
  },

  onLogin: function(){
    User.login();
  },

  onRegister: function( form_data ){
    User.register( form_data );
  },

  renderButton: function(){
    var isLoggedIn = this.state.loginStatus == 'connected';
    var isRegistered = this.state.registeredStatus == 'registered'
    if (isLoggedIn && isRegistered ) return <a href="#" className="navbar-brand" onClick={this.onLogout}>Logout</a>
    return <a onClick={this.onLogin} href="#" className="navbar-brand">Soldador Hilco</a>
  },

  renderRegister: function(){
    if(this.state.registeredStatus == 'registered' ) return <a>Edit</a>;
    else if(this.state.showRegisterForm) return <Register onRegister={this.onRegister} />
    else if(this.state.user_register_error){
      return <div>
        <p>{this.state.user_register_error.userMessage}</p>
      </div>
    }
  },

  render: function(){
    return <div className="navbar navbar-static-top navbar-dark bg-inverse">
      <div className="container-fluid">
        {this.renderButton()}
        <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbar-header" aria-controls="navbar-header" aria-expanded="false" aria-label="Toggle navigation"></button>
      </div>
    </div>
  },

})


module.exports = Header;
