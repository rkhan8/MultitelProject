//JQuery

//execute function while page is loaded
$(document).ready(function()
{
  $('#input-tab').keyup(function() //take value from searchbar
  {
    searchTable1($(this).val()); //search this value in the table
  });
});


function searchTable1(inputVal)
{
  var table = $('#donnee'); //table id

  table.find('tr').each(function(index, row) //retrieve tr from table
  {
    var allCells = $(row).find('td'); //find td
    if(allCells.length > 0)
    {

      var found = false; //set false as default for not found
      allCells.each(function(index, td)
      {
        var regExp = new RegExp(inputVal, 'i'); //use regular expression to search; i=case insensitive match
        if(regExp.test($(td).text())) //if expression typed is contained in td fields
        {
          found = true; //set status true when it's found
          return false; //end browsing
        }
      });

      //check status and define the behaviour
      if(found == true)
      {
        $(row).show(); //show result
      }
      else
      {
        $(row).hide(); //hide other content
      }

    }
  });
}
