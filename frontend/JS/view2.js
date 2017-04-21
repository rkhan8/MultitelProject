var socket = io();

function LoadSearchKeyData(){
    //get idN, category, unity DateRec from table Signals
    socket.emit('getSignalsId');
    socket.emit('getSignalsCategories');
    socket.emit('getSignalsUnity');
    socket.emit('getRecordingDates');
}

socket.on('signalsCategories', function(categories){
    populateComboboxFromArray('catListbox',categories);
});

socket.on('recordingDates', function(dates){
    populateComboboxDateFromArray('startDateListbox',dates);
    populateComboboxDateFromArray('endDateListbox',dates);
});

socket.on('signalsId', function(signalsId){
    populateComboboxFromArray('idNListbox',signalsId);
});

socket.on('signalsUnity', function(unities){
    populateComboboxFromArray('unityListbox',unities);

});

socket.on('signalsValues', function(signalsValues){
    populateSignalsValuesTable(signalsValues);
});



function searchSignalsValuesBySelectedKey()
{

  loadshow();

  var idN = $('#idNListbox option:selected').text();
  var category = $('#catListbox option:selected').text();
  var unity = $('#unityListbox option:selected').text();
  var startDate = $('#startDateListbox option:selected').text();
  var endDate = $('#endDateListbox option:selected').text();

  socket.emit('searchSignalsValues', idN, category, unity, startDate, endDate);

}

function exportResearchData(type, fn) {
    return export_table_to_excel('table1', type || 'xlsx', fn);
}



function populateSignalsValuesTable(signalsValues)
{

  $("#table1 tr").remove(); //remove previous search data
    var table = document.getElementById("table1");
  //show element first table (id, cat, oldVolume, newVolume)
  for(var j =0; j < signalsValues.length; j++)
  {
    //inserting table content by incrementing all the element into the arraylist

    var row = table.insertRow(table.rows.length);

    row.insertCell(0).innerHTML = signalsValues[j].idN.replace('_', ' ');
    row.insertCell(1).innerHTML = signalsValues[j].signal.Category;
    row.insertCell(2).innerHTML = signalsValues[j].signal.MinValue;
    row.insertCell(3).innerHTML = signalsValues[j].signal.MaxValue;
    row.insertCell(4).innerHTML = signalsValues[j].ValueRec;
    row.insertCell(5).innerHTML = signalsValues[j].signal.Unity;
    var dateRec = $.datepicker.formatDate( "dd-mm-yy", new Date( signalsValues[j].DateRec ));
    row.insertCell(6).innerHTML = dateRec;

  }

  //load graph data
  LoadLineGraph(signalsValues);
  LoadHistoGraph(signalsValues);

  load();


}

function populateComboboxDateFromArray(comboboxId, array){
    var data = '<option></option>'
    $('#'+comboboxId).append(data);
    for (i = 0; i < array.length; i++) {
        var date = array[i].slice(0, 10).split('-');
        var data = '<option>' + $.datepicker.formatDate( "dd-mm-yy", new Date( date ))+'</option>';
        $('#'+comboboxId).append(data);

    }
}


function populateComboboxFromArray(comboboxId, array){
    var data = '<option></option>'
    $('#'+comboboxId).append(data);

    for (i = 0; i < array.length; i++) {
        var data = '<option>' + array[i] + '</option>'
        $('#'+comboboxId).append(data);
    }
}

//Timeout Async execution function
function executeAsync(func)
{
  setTimeout(func, 0);
}

//Sort filter for table1
var filterSort1 = function()
{
  $('#donnee').tablesorter({
       sortList: [[0, 0]]
    });
}





$(document).ready(function()
{
    LoadSearchKeyData();
    executeAsync(filterSort1);

});
