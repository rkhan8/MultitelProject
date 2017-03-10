
    var socket = io();
    var generators = new Array();
    var generatorIsActivated = false;


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
            $(valueDisplayer).css('border-color', 'black');
            $(valueDisplayer).css('padding', '5px');
            $(valueDisplayer).css('height', '20px');
            $(newGenerator).append(valueDisplayer);
            $(newGenerator).attr('id', generators.length + 1 );
            $(newGenerator).attr('category', $('#category option:selected').val());
            $(newGenerator).attr('valMin', $('#valMin').val());
            $(newGenerator).attr('valMax', $('#valMax').val());

            newGenerator.css('position', 'absolute');
            newGenerator.css('top', ui.position.top);
            newGenerator.css('left', ui.position.left);

            newGenerator.appendTo(droppable);
            generators.push(newGenerator);
            //show_popup( $(newGenerator).attr('id'));
            show_popup();

            $(newGenerator).click(function (){
                var currentGenerator = $(this);
                var id = $(this).attr('id');
                var category = $(this).attr('category');
                var valMin = $(this).attr('valMin');
                var valMax = $(this).attr('valMax');
                //show_popup($(this).attr('id'))
                update_generator(id, category, valMin, valMax);
            });
        }
      });
    } );


    var generatorId = "";
    var generatorName = "";
    var generatorCategory = "";
    var generatorValMin = "";
    var generatorValMax = "";

    function validateFields() {
        $('#errorMsg').text("");
        if (document.getElementById('valMin').value == "" || document.getElementById('valMax').value == "") {
            $('#errorMsg').text("Vous devez donner la valeur min et la valeur max de l'intervalle");
        }
        else if(parseInt(document.getElementById('valMin').value) >= parseInt(document.getElementById('valMax').value)) {
            $('#errorMsg').text("La valeur minimale  de l'intervalle doit être inférieure à sa valeur maximale");
        }
        else if(document.getElementById('name').value == "") {
            $('#errorMsg').text("Vous devez spécifier le nom du générateur");
        }
        else if(document.getElementById('category').selectedIndex == 0) {
            $('#errorMsg').text("Vous devez spécifier la catégorie du générateur");
        }
        else {
            $('#errorMsg').text("");

            generatorId = $('#name').val();
            generatorCategory = $('#category option:selected').val();
            generatorValMin = $('#valMin').val();
            generatorValMax = $('#valMax').val();
            if(!$('#'+ generatorId).length){
                $('#' + generators.length).attr('id', generatorId);
            }

            hide_popup();
            generateSignal();
        }

    }
    //Function to display popup
    function show_popup() {
        $('#errorMsg').text("");
        $('#name').val('');
        $('#category option:selected').val('');
        $('#valMin').val('');
        $('#valMax').val('');
        $('#popupContent').css('display', 'block');
    }

    //Function To update generator
    function update_generator(generatorId, generatorCategory, generatorValMin, generatorValMax) {
        $('#errorMsg').text("");
        $('#popupContent').css('display', 'block');
        $('#name').val(generatorId );
        $('#valMin').val(generatorValMin);
        $('#valMax').val(generatorValMax);
        $('#category').selectedOptions(generatorCategory);
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
