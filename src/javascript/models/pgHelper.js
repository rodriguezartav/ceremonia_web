var PGHelper = function(){

}

PGHelper.parseQuery = function(response){
  console.log(response);
  var rows = response.rows;
  rows.fields = response.fields;
  return rows;
}

PGHelper.parseSingleInsert = function(response, originalObject){
  console.log(response);
  if(response.rows.length > 0){
    var row = response.rows[0];
    originalObject.id = row.id;
    return originalObject;
  }
  return null;
}

module.exports= PGHelper;
