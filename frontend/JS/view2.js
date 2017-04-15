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

function populate(data, dataa, dataaa, data2)
{

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
  }

  for(var i = 0; i<dataa.length; i++)
  {
    //populate category
    select3.options[0] = new Option("");
    select3.options[select3.options.length] = new Option(dataa[i].Unity);
  }

  for(var i = 0; i<dataaa.length; i++)
  {
    //populate unity
    select2.options[0] = new Option("");
    select2.options[select2.options.length] = new Option(dataaa[i].Category);
  }

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
    row.insertCell(3).innerHTML = dataSearch[j].MaxVal;
    row.insertCell(4).innerHTML = dataSearch[j].ValueRec;
    row.insertCell(5).innerHTML = dataSearch[j].Unity;
    var s = dataSearch[j].DateRec;
    row.insertCell(6).innerHTML = s.substring(0, s.indexOf('T'));
    //row.insertCell(5).innerHTML = Intl.NumberFormat().format(ListTab[0][j][4]);
  }

  //load graph data
  LoadLineGraph(dataSearch);
  LoadHistoGraph(dataSearch);

}

function exportResearchData() {
  var table = document.getElementById('table1');
  var rowsLength = table.rows.length;
  var columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  var columnsLength = columns.length;

  var workbook = XLSX.utils.table_to_book(table);
  alert(workbook);
  var first_sheet_name = workbook.SheetNames[0];
  var desired_value = '';
  /* Get worksheet */
  var worksheet = workbook.Sheets[first_sheet_name];

  for(var i=1; i <= rowsLength; i++) {
    for(var j=0; j < columnsLength; j++) {
      var address_of_cell = columns[j] + i.toString();
      /* Find desired cell */
      var desired_cell = worksheet[address_of_cell];
      /* Get the value */
      desired_value = (desired_cell ? desired_cell.v : undefined);
    }
  }
  alert(workbook);
  XLSX.writeFile(workbook, 'out.xlsx');

  /* bookType can be 'xlsx' or 'xlsm' or 'xlsb' or 'ods' */
  var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };

  var wbout = XLSX.write(workbook, wopts);

  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  var FileSaver = require('file-saver');

    /* the saveAs call downloads a file on the local machine */
  FileSaver.saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "testDownload.xlsx");
}


//get idN, category, unity DateRec from table Signals
socket.on('PreDonnee', function(data, dataa, dataaa){
    socket.on('PreDonnee2', function(data2){
        populate(data, dataa, dataaa, data2);
    });
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
