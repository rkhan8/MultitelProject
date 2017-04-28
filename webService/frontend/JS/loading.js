$(document).ready(function()
{

    if($(document).ready)
    {
      load();
    }

});

function load()
{
  setTimeout(function(){$(".loading").hide();}, 1000);
}

function loadshow() {
  setTimeout(function(){$(".loading").show();}, 1000);
}
