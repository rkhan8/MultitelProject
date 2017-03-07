
    var socket = io();
    $( function() {
      $( ".generator" ).draggable({
          revert: "invalid",
          stack: ".draggable",
          helper:'clone'
      });
      $( "#droppableContent" ).droppable({
        drop: function( event, ui ) {
            var droppable = $(this);
            var draggable = ui.draggable;
            draggable.clone().appendTo(droppable);
            show_popup();
            // create input text
            var input = document.createElement('input');
            document.getElementById('droppableContent').appendChild(input);
            $(input).css('width', '50px');
            $(input).css('border-color', 'black');
            $(input).css('padding', '5px');
            $(input).css('height', '20px')
        }
      });
    } );



    function validateFields() {
        $('#errorMsg').text("");
        if (document.getElementById('valMin').value == "" || document.getElementById('valMax').value == "") {
            $('#errorMsg').text("Vous devez donner la valeur min et la valeur max de l'intervalle");
        }
        else if(parseInt(document.getElementById('valMin').value) >= parseInt(document.getElementById('valMax').value)) {
            $('#errorMsg').text("La valeur minimale  de l'intervalle doit être inférieure à sa valeur maximale");
        }
        else {
            $('#errorMsg').text("");
            createSignal();
            hide_popup();
        }

    }
    //Function To Display Popup
    function show_popup() {
        $('#errorMsg').text("");
        $('#popupContent').css('display', 'block');
    }
    //Function to Hide Popup
    function hide_popup() {
        $('#errorMsg').text("");
        $('#popupContent').css('display', 'none');

    }

    function createSignal(){

        socket.emit("createSignal",
            {
                valMin : $('#valMin').val(),
                valMax : $('#valMax').val()
            });
    }

    function generateSignal(){
      socket.emit('activateSignal');
      socket.on('newValue', function(newValue){
          $('#value').val(newValue);
      });
    }


/*
    function generate()
    {
      var socket = io();
      var val = [];
      val.push($('#valMin').val(), $('#valMax').val());
      socket.emit("sending_view1",
      {
          message : val
      });

      var vall = "";


      socket.on('sending_values', function(res)
      {
        vall = res['message2'];
        //alert(vall);

        $('#value').val(vall);
        //alert(vall);
        //console.log(vall);
      });


    }
    */

    function getvalues()
    {

    }

