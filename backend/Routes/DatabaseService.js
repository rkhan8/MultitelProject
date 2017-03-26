/*var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'multitelroot',
  database : 'Multitel'
});*/

var Database = require('../Model/Database');
var EventEmitter = require('events').EventEmitter;
var PreloadValueEvent = new EventEmitter();
PreloadValueEvent.setMaxListeners(0);

/*
function queryLoad()
{
  //connection.connect();
  //load idN, category and unity
  connection.query('SELECT * from Signals', function(err, rows, fields) {
    if (!err)
    {
      //console.log('Résultat: ', rows);
    }
    else
    {
      console.log('Erreur de la requete');
    }
    PreloadValueEvent.emit('LoadFirstData', rows);

  });

  //load start and end date
  connection.query('SELECT DISTINCT DateRec from SignalValue', function(err, rows2, fields) {
    if (!err)
    {
      //console.log('Résultat: ', rows2);
    }
    else
    {
      console.log('Erreur de la requete');
    }
    PreloadValueEvent.emit('LoadSecondData', rows2);
  });
}
*/

function LoadData()
{
    Database.queryLoad();
    Database.ValueEvent.on('LoadFirstDataDatabase', function (rows) {
      PreloadValueEvent.emit('LoadFirstData', rows);
  });

    Database.ValueEvent.on('LoadSecondDataDatabase', function (rows2) {
      PreloadValueEvent.emit('LoadSecondData', rows2);
  });

}



function QuerySearch(idN, category, unity, startDate, endDate)
{

  Database.QuerySearchData(idN, category, unity, startDate, endDate);
  Database.ValueEvent.on('SearchDataDatabase', function(rows){
    PreloadValueEvent.emit('SearchData', rows);
  });


  /*
  var idNAns = idN;
  var categoryAns = "";
  var unityAns = "";
  var DateAns = "";
  var conditions = "";

  if(idN != "" || category != "" || unity != "" || startDate != "" || endDate != "")
  {
    conditions = "WHERE";

    if(idN != "")
    {
      idNAns = "Signals.idN ='"+idN+"'";
    }
    else
    {
      idNAns = "";
    }


    if(category != "")
    {
      if(idN != "")
      {
        categoryAns = "AND Signals.Category ='"+category+"' ";
      }
      else {
        categoryAns = "Signals.Category ='"+category+"'";
      }
    }
    else
    {
      categoryAns = "";
    }


    if(unity != "")
    {
      if(idN != "" || category != "")
      {
        unityAns = "AND Signals.Unity ='"+unity+"' ";
      }
      else {
        unityAns = "Signals.Unity ='"+unity+"'";
      }
    }
    else
    {
      unityAns = "";
    }


    if(startDate != "" && endDate != "")
    {
      if(idN != "" || category != "" || unity != "")
      {
        DateAns = "AND (SignalValue.DateRec BETWEEN '"+startDate+"' AND '"+endDate+"') ";
      }
      else {
        DateAns = "SignalValue.DateRec BETWEEN '"+startDate+"' AND '"+endDate+"'";
      }
    }
    else
    {
      DateAns = "";
    }


  }
  else {
    conditions = "";
  }

  connection.query('select Signals.idN, Signals.Category, Signals.MinVal, Signals.MaxVal, SignalValue.ValueRec, Signals.Unity, SignalValue.DateRec from Signals natural join SignalValue '+conditions+' '+idNAns+' '+categoryAns+' '+unityAns+' '+DateAns+';', function(err, rows, fields) {
    if (!err)
    {
      //console.log('Résultat: ', rows);
    }
    else
    {
      console.log('Erreur de la requete');
      console.log(err);
    }
    PreloadValueEvent.emit('SearchData', rows);
  });
  */
}

exports.LoadData = LoadData;
exports.QuerySearch = QuerySearch;
exports.PreloadValueEvent = PreloadValueEvent;
