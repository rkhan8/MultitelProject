
var Database = require('../Model/Database');
var EventEmitter = require('events').EventEmitter;
var PreloadValueEvent = new EventEmitter();
PreloadValueEvent.setMaxListeners(0);


function LoadData()
{
    Database.queryLoad();
}


function QuerySearch(idN, category, unity, startDate, endDate)
{
  Database.QuerySearchData(idN, category, unity, startDate, endDate);
}

function StoreSignal(signal)
{
  Database.StoreSignalDatabase(signal);
}

function StoreSignalData(signalData)
{
  Database.StoreSignalDataDatabase(signalData);
}

exports.LoadData = LoadData;
exports.QuerySearch = QuerySearch;
exports.StoreSignal = StoreSignal;
exports.StoreSignalData = StoreSignalData;

exports.PreloadValueEvent = PreloadValueEvent;
