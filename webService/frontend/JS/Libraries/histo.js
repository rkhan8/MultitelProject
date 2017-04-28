var DateTab = [];
var Data = [];
var datasetName = "";
var config;

function LoadHistoGraph(dataSearch)
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
    createHist(DateTab, Data);

}



var barChartData;
function createHist(DateTab, Data)
{
      //intialize the histogramme canvas
      var ctx = document.getElementById("canvasHisto").getContext("2d");
      //defined histogramme content
      barChartData =
      {
          labels: DateTab,
          datasets:
          [
            {
              label: 'Dataset',
              backgroundColor: "green",
              data: Data
            }
          ]
      };

      //define histogramme parameter
      window.myBar = new Chart(ctx, {
          type: 'bar',
          data: barChartData,
          options: {
              elements: {
                  rectangle: {
                      borderWidth: 2,
                      borderColor: 'rgb(0, 255, 0)',
                      borderSkipped: 'bottom'
                  }
              },
              responsive: true,
              legend: {
                  position: 'top',
              },
              title: {
                  display: true,
                  text: 'Volume evolution'
              }
          }
      });

      //barChartData.datasets.splice(0, 2); //Remove previous dataset
      window.myBar.update();

}
