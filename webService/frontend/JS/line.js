var DateTab = [];
var Data = [];
var datasetName = "";
var config;


function LoadLineGraph(dataSearch)
{
  DateTab = []; //clear previous DateData
  Data = []; //clear previous data

  for(var i = 0; i < dataSearch.length; i++)
  {
    var s = dataSearch[i].DateRec;
    DateTab.push(s.substring(0, s.indexOf('T')));
    Data.push(dataSearch[i].ValueRec);
    //datasetName = dataSearch[0].DateRec
  }
  createLineGraph(DateTab, Data);
}



function createLineGraph(DateTab, Data)
{
  //var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var ctx = document.getElementById("canvasLine").getContext("2d");

  config = {
      type: 'line',
      data: {
          labels: DateTab,
          datasets: [{
              label: "dataset",
              backgroundColor: window.chartColors.red,
              borderColor: window.chartColors.red,
              data: Data,
              fill: false,
          }]
      },
      options: {
          responsive: true,
          title:{
              display:true,
              text:'Courbe evolutive'
          },
          tooltips: {
              mode: 'index',
              intersect: false,
          },
          hover: {
              mode: 'nearest',
              intersect: true
          },
          scales: {
              xAxes: [{
                  display: true,
                  scaleLabel: {
                      display: true,
                      labelString: 'Date'
                  }
              }],
              yAxes: [{
                  display: true,
                  scaleLabel: {
                      display: true,
                      labelString: 'Mesure'
                  }
              }]
          }
      }
  };

  window.myLine = new Chart(ctx, config);
  window.myLine.update();


}
