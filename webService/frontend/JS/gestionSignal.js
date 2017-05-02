var socket = io();
//var generators = new Array();
var charts = new Array();
var view = 'gestionSignal';


socket.emit('getAllDisplayedSignals', view);
socket.on('signalInfos', function (signalInfos) {

console.log(signalInfos)
})

socket.on('compagnie', function (data) {
    data.unshift('Compagnie');
    populateComboboxFromArray('newCompagnieGenerateur', data)
    populateComboboxFromArray('lastCompagnie', data)
});


socket.on('batimentsName', function (data) {

    data.unshift('Nom batiment')
    populateComboboxFromArray('newNomBatiment', data)
    populateComboboxFromArray('lastBatimentName', data)
});

socket.on('batimentsInfos', function (batimenInfos) {
    var etages = new Array();
    for (var i = 0; i <= batimenInfos[0].NbEtages; i++) {
        etages.push(i);
    }

    populateComboboxFromArray('lastEtageNumber', etages);
    populateComboboxFromArray('newNumeroEtage', etages);

});

socket.on('newValue', function (newValue) {
    $('#' + newValue.signalId).find('.valueDisplay').val(newValue.value);
    updateSignalChart(newValue.signalId, newValue.value);
});

socket.on('displayedSignals', function (signals) {
    initializeOldSignal(signals);
});

socket.on('notDisplayedSignals', function (data) {
    $('#generatorNameIdList option').remove();
    populateComboboxFromArray('generatorNameIdList', data)
});

socket.on('signalRemovedFromDisplay', function () {
    //afficher un popup avec le message
})


$(function () {
    $('#newCompagnieGenerateur').change(function () {
        socket.emit('getCompagnieBatiment', $(this).find('option:selected').val());
    });

    $('#newNomBatiment').change(function () {

        socket.emit('searchBatimentsValues', {
            NomBatiment: $(this).find('option:selected').val(),
            compagnie: $('#newCompagnieGenerateur').find('option:selected').val()
        });
    });

    $('#lastCompagnie').change(function () {
        socket.emit('getCompagnieBatiment', $(this).find('option:selected').val());
    });

    $('#lastBatimentName').change(function () {

        socket.emit('searchBatimentsValues', {
            NomBatiment: $(this).find('option:selected').val(),
            compagnie: $('#lastCompagnie').find('option:selected').val()
        });
    });
});


$(function () {

    $(".generator").draggable({
        stack: ".draggable",
        cursor: 'hand',
        helper: 'clone',
        containment: '#droppableContent',

    });

    $(".ui-drop").droppable({
        activeClass: 'ui-state-hover',
        accept: '.generator, .oldGenerator, .drag',
        //accept: '.ui-draggable',
        drop: function (event, ui) {
            var dropZone = $(this);
            var signal = ui.draggable.clone();
            // var currentPos = ui.helper.position();

            var valueDisplayer = createAndSetupInput();
            $(valueDisplayer).addClass("valueDisplay");
            $(signal).append(valueDisplayer);

            signal.css('position', 'absolute');
            signal.css('top', ui.position.top);
            signal.css('left', ui.position.left);
            signal.appendTo(dropZone);
            // $(signal).addClass('signal')


            var signalName = createAndSetupInput();
            $(signalName).addClass("signalName");
            $(signal).prepend(signalName);

            //generators.push(signal);
            showPopupForSetupNewSignalOnDisplay(signal);
            $(signal).draggable({
                stack: ".draggable",
                cursor: 'hand',
                containment: '#droppableContent',
                stop: function (event, ui) {
                    socket.emit('updateSignalPosition', {
                        signalId: $(this).attr('id'),
                        positionLeft: parseInt($(this).position().left),
                        positionTop: parseInt($(this).position().top),
                        view: view
                    });

                }
            });


            $(signal).click(function () {
                var currentSignal = $(this);
                var signalId = $(currentSignal).attr('id');
                $("#" + signalId + "canvas").remove();
                socket.emit('getSignalInfos', signalId);
                show_updatePopup(signalId);

            });
        }
    });
});



function removeSignalFromDisplay(signalId) {

    socket.emit('removeSignalFromDisplay', signalId);
    socket.emit('deletesignalPosition', signalId);
    $('#' + signalId).remove();
}

function updateSignalInformations(oldSignalId) {

    newSignalId = $('#lastGeneratorName').val();
    socket.emit("updateSignalInformations",
        {
            oldSignalId: oldSignalId,
            signalId: $('#lastGeneratorName').val(),
            category: $('#lastGategory').find(":selected").val(),
            unity: $('#lastUnity').val(),
            nomBatiment: $('#lastBatimentName').find(":selected").val(),
            compagnie: $('#lastCompagnie').find(":selected").val(),
            numeroEtage: $('#lastEtageNumber').find(":selected").val()

        });
    updateSignalInfos(newSignalId, oldSignalId);
    hide_popup();

}

function initializeOldSignal(signals) {
    for (var i = 0; i < signals.length; i++) {
        var signal = $('<div><img src="../images/temperature.jpg" height="50px" width="50px"></div>');
        $("#droppableContent").append(signal);
        signal.get(0).setAttribute("id", signals[i].idN);
        signal.draggable({
            stack: ".draggable",
            cursor: 'hand',
            containment: '#droppableContent',
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
            top: signals[i].signalpositionondropzones[0].PositionTop,
            left: signals[i].signalpositionondropzones[0].PositionLeft
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
}



function removeSignalFromDisplay(signalId) {

    socket.emit('removeSignalFromDisplay', signalId);
    socket.emit('deletesignalPosition', {
        signalId:signalId,
        view: view
    });
    $('#' + signalId).remove();
}


function updateSignalInformations(oldSignalId) {

    newSignalId = $('#lastGeneratorName').val();
    socket.emit("updateSignalInformations",
        {
            oldSignalId: oldSignalId,
            signalId: $('#lastGeneratorName').val(),
            category: $('#lastGategory').find(":selected").val(),
            unity: $('#lastUnity').val(),
            nomBatiment: $('#lastBatimentName').find(":selected").val(),
            compagnie: $('#lastCompagnie').find(":selected").val(),
            numeroEtage: $('#lastEtageNumber').find(":selected").val()

        });
    updateSignalInfos(newSignalId, oldSignalId);



}



function addSignalOnDisplaying() {

    var signalId = $('#generatorNameIdList').val();

    socket.emit("addsignalOnPlayingList",
        {
            signalId: $('#generatorNameIdList').find(':selected').val(),
            category: $('#categoryNewgenerateur option:selected').val(),
            unity: $('#unityNewGenerateur').val(),
            nomBatiment: $('#newNomBatiment').find(":selected").val(),
            compagnie: $('#newCompagnieGenerateur').find(":selected").val(),
            numeroEtage: $('#newNumeroEtage').find(":selected").val()
        });
    updateSignalInfos(signalId);
   // decommenter cette ligne pour afficher le graphe en temps reel du signal -- Mais probleme de performance possible
  //  createSignalGraph(signalId);

}



function createSignalGraph(signalId) {
    var div = $('<div />');
    var canvas = $('<canvas/>', {
        id: signalId + 'canvas',
        class: "canvas2"
    });
    div.append(canvas);
    $(".chartsZone").append(div);
    canvas = $('#' + signalId + 'canvas').get(0).getContext('2d');
    var startingData = {
        labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        datasets: [
            {
                fillColor: "rgba(255,255,255,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }]
    };
    var chart = new Chart(canvas).Line(startingData);
    charts.push({
        id: signalId + 'canvas',
        chart: chart
    });
}


function updateSignalChart(signalId, value) {
    var chart = _.find(charts, {'id': signalId + 'canvas'});
    if (!_.isUndefined(chart)) {
        chart.chart.addData([value], "");
        chart.chart.removeData();
    }
}




function updateSignalInfos(newSignalId, oldSignalId) {
    if (_.isUndefined(oldSignalId))
        var signal = $('#droppableContent').get(0).lastChild;
    else
        var signal = $('#' + oldSignalId)
    var oldId = $(signal).attr('id');


    $(signal).find('.signalName').val(newSignalId);
    $(signal).attr('id', newSignalId);

    var index = _.findIndex(charts, oldId + 'canvas');
    if (index != -1) {
        charts[index].id = newSignalId + 'canvas';
    }
    socket.emit('updateSignalPosition', {
        signalId: newSignalId,
        positionLeft: parseInt($('#' + newSignalId).position().left),
        positionTop: parseInt($('#' + newSignalId).position().top),
        view: view
    });
}

function showPopupForSetupNewSignalOnDisplay(signal) {
    initializePopupField();

    socket.emit('getNotDisplayedSignalsId');
    socket.emit('getComapgniesName');
    $('#errorMsg').text("");
    var dialog = document.querySelector('#EnregistrerGeneratorPopUp');
    $("#enregistrer").one('click', function () {
        addSignalOnDisplaying();
        $('#fermerButton').unbind( "click");
        dialog.close();
    });

    $('#fermerButton').one('click', function () {
        signal.remove();
        $( "#enregistrer" ).unbind( "click");
        dialog.close();
    });
    dialog.showModal();
}

function initializeOldSignal(signals) {
    for (var i = 0; i < signals.length; i++) {
        var signal = $('<div><img src="../images/temperature.jpg" height="50px" width="50px"></div>');
        $("#droppableContent").append(signal);
        signal.get(0).setAttribute("id", signals[i].idN);
        signal.draggable({
            stack: ".draggable",
            cursor: 'hand',
            containment: '#droppableContent',
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
            top: signals[i].signalpositionondropzones[0].PositionTop,
            left: signals[i].signalpositionondropzones[0].PositionLeft
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
}








