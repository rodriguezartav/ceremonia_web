var React = require("react");
var User  = require("../models/user");

var Register =  React.createClass({

  onClick: function(){
    this.props.onRegister({email__c: this.refs.txt_email.value})
  },

  render: function(){
    return <div>
      <input ref="txt_email"/>
      <a onClick={this.onClick}>Register</a>
    </div>
  }

})

module.exports = Register;
