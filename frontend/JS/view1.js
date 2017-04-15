
    var socket = io();
    var generators = new Array();
    //var stoppedGenerator = false;

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
            /*$('#stop').hide();
            $('#reactivate').hide();*/
            show_popup( $(newGenerator).attr('id'));

            $(newGenerator).click(function (){
                var currentGenerator = $(this);
                var generatorId = $(currentGenerator).attr('id');
                socket.on('signalInfos',function(generatorInfos){
                    $('#valMin').val(generatorInfos.minValue);
                    $('#valMax').val(generatorInfos.maxValue);
                    document.getElementById('category').value = generatorInfos.category;
                });

                socket.emit('getSignalInfos', generatorId);
                $('#save').hide();
                $('#update').show();
                /*if(stoppedGenerator == false) {
                    $('#reactivate').hide();
                    $('#stop').show();
                }
                else {
                    $('#reactivate').show();
                    $('#stop').hide();
                }*/
                show_updatePopup(generatorId);
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
                category: $('#category').find(":selected").val()
            });
    }

    function validateFields() {
        $('#errorMsg').text("");
        var nameValue = document.getElementById('generatorName').value;
        var categoryValue = document.getElementById('category').value;
        var genValMin = document.getElementById('valMin');
        var genValMax = document.getElementById('valMax');

        /*if(document.getElementById('category').value == "binary")  {
            document.getElementById('valMin').disabled = true;
            document.getElementById('valMax').disabled = true;
        }*/
        if(categoryValue == "") {
            $('#errorMsg').text("Vous devez spécifier la catégorie du générateur");
        }
        else if (categoryValue != "binary" && (nameValue == "" || genValMin.value == "" || genValMax.value == "" )) {
            $('#errorMsg').text("Vous devez remplir tous les champs");
        }
        else if(categoryValue == "binary" && nameValue == "") {
            $('#errorMsg').text("Vous devez spécifier le nom du générateur");
        }
        else if(parseInt(genValMin.value) >= parseInt(genValMax.value)) {
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

    //Function show_updatePopup
    function show_updatePopup(generatorId) {
        $('#errorMsg').text("");
        $('#popupContent').css('display', 'block');
        $('#generatorName').val(generatorId);
    }

    //Function to Hide Popup
    function hide_popup() {
        $('#errorMsg').text("");
        $('#valMin').val("");
        $('#valMax').val("");
        document.getElementById('category').selectedIndex = 0;
        $('#popupContent').css('display', 'none');

    }

    function createSignal(signalId, min , max, category){

        socket.emit("createSignal",
        {
            signalId : signalId,
            valMin : $('#valMin').val(),
            valMax : $('#valMax').val(),
            category: $('#category option:selected').val()
        });


        //Store signal to database
        /*var SignalId = signalId;
        var Category = $('#category option:selected').val();
        var valMin = $('#valMin').val();
        var valMax = $('#valMax').val();
        var Unity = "J";

        socket.emit("storeSignal",{SignalId, Category, valMin, valMax, Unity});*/
    }

    function createAndSetupInput(){
        var input = document.createElement('input');
        input.disabled = true;
        $(input).css('width', '50px');
        $(input).css('border-color', 'black');
        $(input).css('padding', '5px');
        $(input).css('height', '20px');
        return input;
    }

    function generateSignal(signalId)
    {
      createSignal(signalId);

      socket.emit('activateSignal');
      socket.on('newValue', function(newValue){
          $('#' + newValue.generatorId).find('.valueDisplay').val(newValue.value);

          //store signal data into DATABASE
          //socket.emit("storeSignalData", newValue);

      });
    }

    function addNewGenerator() {
        $('#addGenTextArea').show();
    }

    /*function stopGeneratingSignal() {
        socket.on('newValue', function(newValue){
            $('#' + newValue.generatorId).find('.valueDisplay').val("arrêt");
        });

        //$('.valueDisplay').val("stop");

        hide_popup();
        stoppedGenerator = true;
    }

    function reactivateGeneratingSignal() {
        createNewSignal();
        stoppedGenerator = false;
    }*/