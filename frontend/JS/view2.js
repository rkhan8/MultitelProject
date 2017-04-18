var socket = io();

function LoadSearchKeyData(){
    //get idN, category, unity DateRec from table Signals
    socket.emit('getSignalsId');
    socket.emit('getSignalsCategories');
    socket.emit('getSignalsUnity');
    socket.emit('getRecordingDates')
}

socket.on('signalsCategories', function(categories){
    populateComboboxFromArray('catListbox',categories);
});

socket.on('recordingDates', function(dates){
    populateComboboxFromArray('startDateListbox',dates);
    populateComboboxFromArray('endDateListbox',dates);
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

/* code mort
function populate(data, data2)
{
  //alert (data);
  var select1 = document.getElementById("idNListbox");
  //select1.options.length = 0;

  //populate category
  var select2 = document.getElementById("catListbox");
  //select2.options.length = 0;


  //populate unity
  var select3 = document.getElementById("unityListbox");
  //select3.options.length = 0;


  for(var i = 0; i < data.length; i++)
  {

    //populate idN
    select1.options[0] = new Option("");
    select1.options[select1.options.length] = new Option(data[i].idN);

    //populate Unity
    select3.options[0] = new Option("");
    select3.options[select3.options.length] = new Option(data[i].Unity);

    //populate Category
    select2.options[0] = new Option("");
    select2.options[select2.options.length] = new Option(data[i].Category);
  }




}

function populateDate(data2)
{
  var select4 = document.getElementById("startDateListbox");
  //select4.options.length = 0;

  var select5 = document.getElementById("endDateListbox");
  //select5.options.length = 0;


  for(var i = 0; i< data2.length; i++)
  {
    //populate start date
    var s = data2[i].DateRec;

    select4.options[0] = new Option("");
    select4.options[select4.options.length] = new Option(s.substring(0, s.indexOf('T')));

    //populate end date
    select5.options[0] = new Option("");
    select5.options[select5.options.length] = new Option(s.substring(0, s.indexOf('T')));
  }

}
*/

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
