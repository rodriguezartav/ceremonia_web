var q = require("kew");

function UploadFile(user, type, fileToUpload){
  this.user = user;
  this.type = type;
  this.fileToUpload = fileToUpload;
  this.roleARN  = "arn:aws:iam::904575228420:role/soldadorhilco";
  AWS.config.region = 'us-east-1';
  this.S3 = new AWS.S3( {
    params: {
      Bucket: 'soldadorhilco.rodcocr.com'
    }
  });
  this.S3.config.credentials = new AWS.WebIdentityCredentials({
    ProviderId: 'graph.facebook.com',
    RoleArn: this.roleARN,
    WebIdentityToken: this.user.facebook_authtoken__c.accessToken
  });
}


//  let file = fileChooser.files[0];
UploadFile.prototype.upload = function(){
  var defer = q.defer();
  var params = {
    Key: this.type + '/' + this.user.sfid + '/' + this.fileToUpload.name,
    ContentType: this.fileToUpload.type,
    Body: this.fileToUpload,
    ACL: 'public-read'
  };

  // Upload the file
  this.S3.putObject(params, function(err, data) {
    if(err) return defer.reject(err);
    return defer.resolve(data);
  });
  return defer.promise;
}

module.exports = UploadFile;
