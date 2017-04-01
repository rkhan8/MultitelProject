
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

            var valueDisplayer = createAndSetupInput();

            $(valueDisplayer).addClass("valueDisplay");
            $(newGenerator).append(valueDisplayer);
            $(newGenerator).attr('id',generators.length + 1 );

            var signalName = createAndSetupInput();
            $(signalName).addClass("signalName");
            $(newGenerator).prepend(signalName);



            newGenerator.css('position', 'absolute');
            newGenerator.css('top', ui.position.top);
            newGenerator.css('left', ui.position.left);

            newGenerator.appendTo(droppable);
            generators.push(newGenerator);

            $('#save').show();
            $('#update').hide();
            show_popup( $(newGenerator).attr('id'));


            $(newGenerator).click(function (){
                var currentGenerator = $(this);
                var generatorId = $(currentGenerator).attr('id');
                socket.on('signalInfos',function(generatorInfos){
                    $('#valMin').val(generatorInfos.minValue);
                    $('#valMax').val(generatorInfos.maxValue);
                    $('#category option:selected').val(generatorInfos.category)
                });
                socket.emit('getSignalInfos', generatorId);
                $('#save').hide();
                $('#update').show();
                show_popup($(currentGenerator).attr('id'));
            });
        }
      });
    } );


    function createNewSignal(){
        if(validateFields()){
            var signalId = $('#generatorName').val();
            generateSignal(signalId);
            hide_popup();
        }

    }
    function updateSignal(){
        if(validateFields()){
            var signalId = $('#generatorName').val();
            updateSignalParameters(signalId);
            hide_popup();
        }
    }
    function updateSignalParameters(signalId){
        socket.emit("updateSignal",
            {
                signalId : signalId,
                valMin : $('#valMin').val(),
                valMax : $('#valMax').val(),
                category: $('#category option:selected').val()
            });
    }

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


            var generatorId = $('#generatorName').val();
            if(!$('#'+ generatorId).length){
                $('#' + generators.length).attr('id', generatorId);
            }
            $('#' + generatorId).find('.signalName').val($('#generatorName').val());
            return true;


        }

    }
    //Function To Display Popup
    function show_popup(generatorId) {
        $('#errorMsg').text("");
        $('#popupContent').css('display', 'block');
        $('#generatorName').val(generatorId );
    }
    //Function to Hide Popup
    function hide_popup() {
        $('#errorMsg').text("");
        $('#valMin').val("");
        $('#valMax').val("");
        $('#popupContent').css('display', 'none');

    }

    function hide_gen() {
        $('.generator').css('display', 'none');
    }

    function createSignal(signalId, min , max, category){

        socket.emit("createSignal",
            {
                signalId : signalId,
                valMin : $('#valMin').val(),
                valMax : $('#valMax').val(),
                category: $('#category option:selected').val()
            });
    }

    function createAndSetupInput(){
        var input = document.createElement('input');
        input.disabled = true;
        $(input).css('width', '50px');
        $(input).css('border-color', 'black');
        $(input).css('padding', '5px');
        $(input).css('height', '20px')
        return input;
    }

    function generateSignal(signalId)
    {

      createSignal(signalId);

      socket.emit('activateSignal');
      socket.on('newValue', function(newValue){
          $('#' + newValue.generatorId).find('.valueDisplay').val(newValue.value);

          //INSERT INTO DATABASE

      });
    }
