
var socket = io();
var view ='rechercheSignal'

socket.emit('getComapgniesName');

socket.on('newValue', function (newValue) {
    $('#' + newValue.signalId).find('.valueDisplay').val(newValue.value);
  //  updateSignalChart(newValue.signalId, newValue.value);
});
socket.on('compagnie', function (data) {
    data.unshift('Compagnie');
    populateComboboxFromArray('compagnieListbox', data)
});

socket.on('batimentsName', function (data) {
    data.unshift('Batiments');
    populateComboboxFromArray('batimentListbox', data)
});

socket.on('batimentsInfos', function(batimenInfos){
    var etages = new Array();
    for(var i = 0; i <= batimenInfos[0].NbEtages ; i++){
        etages.push(i);
    }
    etages.unshift('');
    populateComboboxFromArray('etageListbox',etages);
});

socket.on('batimentSignalInformations', function(data){
    // les donnees de la recherche sont retournee ici
    $('#droppableContentBatiment').empty();
    for(var i = 0; i < data.length; i++){
        var signals = data[i].signalbatiments;
        var nomBatiment = data[i].NomBatiment;
        $('#droppableContentBatiment').append( putSignalOnDropZoneByBatimentEtage(signals,nomBatiment));
    }
});





$(function () {
    $('#compagnieListbox').change(function () {
        socket.emit('getCompagnieBatiment', $(this).find('option:selected').val());
    });

    $('#batimentListbox').change(function () {
        socket.emit('searchBatimentsValues', {
            NomBatiment: $(this).find('option:selected').val(),
            compagnie: $('#compagnieListbox').find('option:selected').val()
        });
    });
});



function putSignalOnDropZoneByBatimentEtage(signals, etageDropzoneId) {
    var dropzone = $('<div/>',{
        class: 'droppableContentBatiment ui-drop',
        id: etageDropzoneId
    });
    for (var i = 0; i < signals.length; i++) {
        var signal = $('<div><img src="../images/temperature.jpg" height="50px" width="50px"></div>');
        $(dropzone).append(signal);
        signal.get(0).setAttribute("id", signals[i].idN);
        signal.draggable({
            stack: ".draggable",
            cursor: 'hand',
            containment: '#'+etageDropzoneId,
            stop: function (event, ui) {
                socket.emit('updateSignalPosition', {
                    signalId: $(this).attr('id'),
                    positionLeft: parseInt($(this).position().left),
                    positionTop: parseInt($(this).position().top),
                    view: view
                });
            }
        });

        $(signal).css({
            position: "absolute"
        }).show();
        ///ajuster la position des anciens generateurs ici
        $(signal).offset({
            top: signals[i].signal.signalpositionondropzones[0].PositionTop,
            left: signals[i].signal.signalpositionondropzones[0].PositionLeft
        });


        var signalName = createAndSetupInput();
        $(signalName).addClass("signalName");
        $(signalName).val(signals[i].idN);
        $(signal).prepend(signalName);


        var valueDisplayer = createAndSetupInput();
        $(valueDisplayer).addClass("valueDisplay");
        $(signal).append(valueDisplayer);


        $(signal).click(function () {
            var signalId = $(this).attr('id');
            socket.emit('getSignalInfos', signalId);
            show_updatePopup(signalId);
        });
        // decommenter cette ligne pour afficher le graphe en temps reel du signal -- Mais probleme de performance possible
        //createSignalGraph(signals[i].idN);
    }
    return dropzone;
}


function findSignals()
{
 socket.emit('findSignalsBySelectOption',{
     nomBatiment: $('#batimentListbox').find(":selected").val(),
     compagnie: $('#compagnieListbox').find(":selected").val(),
     numeroEtage: $('#etageListbox').find(":selected").val()
 })
}
