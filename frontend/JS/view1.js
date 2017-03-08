
    var socket = io();
    var generators = new Array();

    $( function() {
      $( ".generator" ).draggable({
          revert: "invalid",
          stack: ".draggable",
          helper:'clone'
      });
      $( "#droppableContent" ).droppable({
        drop: function( event, ui ) {
            var droppable = $(this);
            var newGenerator = ui.draggable.clone();

            var valueDisplayer = document.createElement('input');
             valueDisplayer.disabled = true;

            $(valueDisplayer).css('width', '50px');
            $(valueDisplayer).css('border-color', 'black');
            $(valueDisplayer).css('padding', '5px');
            $(valueDisplayer).css('height', '20px');
            newGenerator[0].appendChild(valueDisplayer);
            newGenerator[0].id = generators.length + 1;

            newGenerator[0].click(function (){
                var test = $(this);
            });

            newGenerator.appendTo(droppable);
            //newGenerator.clone().appendTo(droppable);
            // create valueDisplayer text
            /*document.getElementById('droppableContent').appendChild(valueDisplayer);*/
            generators.push(newGenerator[0]);
            show_popup();

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
            generateSignal();

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
                generatorNumber : generators.length - 1,
                valMin : $('#valMin').val(),
                valMax : $('#valMax').val()
            });
    }

    function generateSignal(){

      socket.emit('activateSignal');
      socket.on('newValue', function(newValue){

          generators[newValue.generatorId].getElementsByTagName('input')[0].value = newValue.value;
      });
    }




