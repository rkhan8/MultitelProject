
    var socket = io();
    var generators = new Array();

    $( function() {
      $( ".generator" ).draggable({
          stack: ".draggable",
          cursor:'hand',
          helper:'clone'
      });

      $( ".ui-drop" ).droppable({
        activeClass: 'ui-state-hover',
        accept: '.generator',
        drop: function( event, ui ) {
            var droppable = $(this);
            var newGenerator = ui.draggable.clone();

            var valueDisplayer = document.createElement('input');
             valueDisplayer.disabled = true;
            $(valueDisplayer).css('width', '50px');
            $(valueDisplayer).addClass("valueDisplay");
            $(valueDisplayer).css('border-color', 'black');
            $(valueDisplayer).css('padding', '5px');
            $(valueDisplayer).css('height', '20px');
            $(newGenerator).append(valueDisplayer);
            $(newGenerator).attr('id',generators.length + 1 );



            newGenerator.css('position', 'absolute');
            newGenerator.css('top', ui.position.top);
            newGenerator.css('left', ui.position.left);

            newGenerator.appendTo(droppable);
            generators.push(newGenerator);
            show_popup( $(newGenerator).attr('id'));
            
            $(newGenerator).click(function (){
                var currentGenerator = $(this);
                show_popup($(currentGenerator).attr('id'))
            });
        }
      });
    } );


    var generatorId = "";

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

            generatorId = $('#nomGenerateur').val();
            if(!$('#'+ generatorId).length){
                $('#' + generators.length).attr('id', generatorId);
            }

            hide_popup();
            generateSignal();
        }

    }
    //Function To Display Popup
    function show_popup(generatorId) {
        $('#errorMsg').text("");
        $('#popupContent').css('display', 'block');
        $('#nomGenerateur').val(generatorId );
    }
    //Function to Hide Popup
    function hide_popup() {
        $('#errorMsg').text("");
        $('#popupContent').css('display', 'none');

    }

    function hide_gen() {
        $('.generator').css('display', 'none');
    }

    function createSignal(generatorId){

        socket.emit("createSignal",
            {
                generatorId : generatorId,
                valMin : $('#valMin').val(),
                valMax : $('#valMax').val(),
                category: $('#category option:selected').val()
            });
    }

    function generateSignal(){

      createSignal(generatorId);

      socket.emit('activateSignal');
      socket.on('newValue', function(newValue){
          $('#' + newValue.generatorId).find('input').val(newValue.value);
      });
    }
