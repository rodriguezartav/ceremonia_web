var React = require("react");
var User  = require("../models/user");
var File = require("../models/file");

var Projecto =  React.createClass({

  componentDidMount: function(){
    var _this = this;
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s);
       js.id = id;
       js.src = 'https://sdk.amazonaws.com/js/aws-sdk-2.6.10.min.js';
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'aws-jssdk'));
  },

  onCreate: function(e){
    var fileChooser = this.refs.srcFile;
    var fileToUpload = fileChooser.files[0];

     // Check that the user has specified a file to upload
     if (!fileToUpload) {
       alert("You must choose a file to upload!");
       return;
     }

     // Check the MIME type is an image
     if (fileToUpload.type.indexOf("image") == -1) {
       alert("You may only upload images");
       return;
     }

     this.props.onCreate({
      Nombre__c: this.refs.txtNombre.value,
      Ubicacion__c: this.refs.txtUbicacion.value,
      FileName__c: 'proyecto/' + User.current.sfid + '/' + fileToUpload.name,
     }, fileToUpload);
  },

  render: function(){
    return <div classNameName="album text-muted">
      <div classNameName="container">
        <div classNameName="row">

          <form>
            <div className="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input type="text" className="form-control" ref="txtNombre" aria-describedby="emailHelp" placeholder="Enter email"/>
              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input type="text" className="form-control" ref="txtUbicacion" placeholder="Password"/>
            </div>
            <div className="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input ref="srcFile" type="file" id="file-chooser" />
            </div>
          </form>

          <button onClick={this.onCreate} id="upload-button">Upload Image</button>


        </div>
      </div>
    </div>
  }

})

module.exports = Projecto;
