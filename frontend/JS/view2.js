var socket = io();

function LoadDB(){
  socket.emit('loadDB');
}

function QuerySearch()
{
  var idN = $('#idNListbox option:selected').text();
  var category = $('#catListbox option:selected').text();
  var unity = $('#unityListbox option:selected').text();
  var startDate = $('#startDateListbox option:selected').text();
  var endDate = $('#endDateListbox option:selected').text();

  socket.emit('search', idN, category, unity, startDate, endDate);

}

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


function populateTable(dataSearch)
{

  $("#table1 tr").remove(); //remove previous search data

  //show element first table (id, cat, oldVolume, newVolume)
  for(var j =0; j < dataSearch.length; j++)
  {
    //inserting table content by incrementing all the element into the arraylist
    var table = document.getElementById("table1");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    row.insertCell(0).innerHTML = dataSearch[j].idN.replace('_', ' ');
    row.insertCell(1).innerHTML = dataSearch[j].Category;
    row.insertCell(2).innerHTML = dataSearch[j].MinVal;
    row.insertCell(3).innerHTML = dataSearch[j].MaxVal;;
    row.insertCell(4).innerHTML = dataSearch[j].ValueRec;;
    row.insertCell(5).innerHTML = dataSearch[j].Unity;
    var s = dataSearch[j].DateRec;
    row.insertCell(6).innerHTML = s.substring(0, s.indexOf('T'));
    //row.insertCell(5).innerHTML = Intl.NumberFormat().format(ListTab[0][j][4]);
  }

  //load graph data
  LoadLineGraph(dataSearch);
  LoadHistoGraph(dataSearch);

}



//get idN, category, unity DateRec from table Signals
socket.on('PreDonnee', function(data){
    populate(data);
});

socket.on('PreDonnee2', function(data2){
    populateDate(data2);
});



socket.on('SearchData', function(dataSearch){
      populateTable(dataSearch);
});


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
    LoadDB();
    executeAsync(filterSort1); //execute filter after initialize the table1
    //socket.setMaxListeners();//setMaxListeners to avoid memory leak (emit socket > 10)

});
