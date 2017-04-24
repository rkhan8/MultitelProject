var socket = io();
var generators = new Array();
var charts = new Array();


socket.emit('getAllDisplayedSignals');
socket.on('signalInfos', function (signalInfos) {


})

socket.on('compagnie', function (data) {
    $('#newCompagnieGenerateur option').remove();
    $('#lastCompagnie option').remove();
    populateComboboxFromArray('newCompagnieGenerateur', data)
    populateComboboxFromArray('lastCompagnie', data)
});

socket.on('batimentsName', function (data) {
    $('#newNomBatiment option').remove();
    $('#lastBatimentName option').remove();
    populateComboboxFromArray('newNomBatiment', data)
    populateComboboxFromArray('lastBatimentName', data)
});
socket.on('batimentsInfos', function (batimenInfos) {
    var etages = new Array();
    for (var i = 0; i <= batimenInfos[0].NbEtages; i++) {
        etages.push(i);
    }


    $('#lastEtageNumber option').remove();
    $('#newNumeroEtage option').remove();
    populateComboboxFromArray('lastEtageNumber', etages);
    populateComboboxFromArray('newNumeroEtage', etages);

});

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
            var generator = ui.draggable.clone();
            // var currentPos = ui.helper.position();

            var valueDisplayer = createAndSetupInput();
            $(valueDisplayer).addClass("valueDisplay");
            $(generator).append(valueDisplayer);

            generator.css('position', 'absolute');
            generator.css('top', ui.position.top);
            generator.css('left', ui.position.left);
            generator.appendTo(dropZone);
            $(generator).addClass('signal')


            if ($(generator).hasClass('generator')) {
                setupNewSignal(generator);
                $(generator).removeClass('generator');
            }

            if ($(generator).hasClass('oldGenerator')) {
                setupOldsignal(generator);
                ui.draggable.remove();
                $(generator).removeClass('oldGenerator');
            }

            $(generator).draggable({
                stack: ".draggable",
                cursor: 'hand',
                containment: '#droppableContent',
                stop: function (event, ui) {
                    socket.emit('updateSignalPosition', {
                        signalId: $(this).attr('id'),
                        positionLeft: parseInt($(this).position().left),
                        positionTop: parseInt($(this).position().top),
                        view: 'gestionsignal'
                    });
                    //  alert("left=" + parseInt($(this).position().left) + " top=" + parseInt($(this).position().top));

                }
            });


            $('.signal').click(function () {
                var currentGenerator = $(this);
                var signalId = $(currentGenerator).attr('id');

                socket.emit('getSignalInfos', signalId);
                $('#save').hide();
                $('#update').show();
                show_updatePopup(signalId);
               // socket.emit('updateSignalPosition')
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
function setupOldsignal(signal) {
    var signalId = $(signal).attr('id');

    createSignalGraph(signalId);
}

function setupNewSignal(signal) {


    // $(signal).attr('id', generators.length + 1);
    var signalName = createAndSetupInput();
    $(signalName).addClass("signalName");
    $(signal).prepend(signalName);

    generators.push(signal);

    $('#save').show();
    $('#update').hide();
    show_popup();
}

function initializeOldSignal(signals) {


    for (var i = 0; i < signals.length; i++) {
        var generator = $('<div><img src="../images/temperature.jpg" height="50px" width="50px"></div>');
        $("#droppableContent").append(generator);
        generator.get(0).setAttribute("id", signals[i].idN);
        generator.draggable({
            stack: ".draggable",
            cursor: 'hand',
            containment: '#droppableContent',
            stop: function (event, ui) {
                socket.emit('updateSignalPosition', {
                    signalId: $(this).attr('id'),
                    positionLeft: parseInt($(this).position().left),
                    positionTop: parseInt($(this).position().top),
                    view: 'gestionsignal'
                });
            }
        });

        $(generator).css({
             position: "fixed"
         }).show();
        ///ajuster la position des anciens generateurs ici
        $(generator).offset({top:signals[i].signal.signalpositionondropzones[0].PositionTop, left:signals[i].signal.signalpositionondropzones[0].PositionLeft});


        var signalName = createAndSetupInput();
        $(signalName).addClass("signalName");
        $(signalName).val(signals[i].idN);
        $(generator).prepend(signalName);
        generators.push(signals[i].idN);

        var valueDisplayer = createAndSetupInput();
        $(valueDisplayer).addClass("valueDisplay");
        $(generator).append(valueDisplayer);
        $(generator).addClass('signal');

        $('.signal').click(function () {
            var currentGenerator = $(this);
            var signalId = $(currentGenerator).attr('id');

            socket.emit('getSignalInfos', signalId);
            $('#save').hide();
            $('#update').show();
            show_updatePopup(signalId);
            setupOldsignal(generator);

           // socket.emit('updateSignalPosition')
        });
    }
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


        //hide_popup();
        updateSignalInfos(signalId);
        createSignalGraph(signalId);

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
                fillColor: "rgba(151,187,205,0.2)",
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


function validateFields() {
    $('#errorMsg').text("");

    var signalName = $('#generatorNameIdList').find(':selected').val();
    var category = $('#categoryNewgenerateur').find(":selected").val();
    var unityValue = $('#unityNewGenerateur').val();
    var compagnie = $('#newCompagnieGenerateur').find(":selected").val();
    var nomBatiment = $('#newNomBatiment').find(":selected").val();
    var numeroEtage = $('#newNumeroEtage').find(":selected").val();

    if (category == "") {
        $('#errorMsg').text("Vous devez spécifier la catégorie du générateur");
    }

    else if (category == "binary" && (signalName == "" || unityValue == "")) {
        $('#errorMsg').text("Vous devez spécifier le nom et/ou l'unité du générateur");
    }
    else {
        $('#errorMsg').text("");

        var signalId = $('#generatorName').val();
        updateSignalInfos(signalId);
        return true;
    }
}
//Function To Display Popup


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
    socket.emit('createSignalPosition', {
        signalId: newSignalId,
        positionLeft: parseInt($('#' + newSignalId).position().left),
        positionTop: parseInt($('#' + newSignalId).position().top),
        view: 'gestionsignal'
    });
}

function show_popup(signalId) {

    socket.emit('getNotDisplayedSignalsId');
    socket.emit('getComapgniesName');
    $('#errorMsg').text("");
    var dialog = document.querySelector('#EnregistrerGeneratorPopUp');
    $("#enregistrer").one('click', function () {

        dialog.close();
    });
    dialog.showModal();
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
}

//Function show_updatePopup
function show_updatePopup(signalId) {
    socket.emit('getComapgniesName');

    $('#removeSignalButton').click(function () {
        removeSignalFromDisplay(signalId);
        $( "#"+signalId+"canvas").remove();


    });
    $('#errorMsg').text("");
    var dialog = document.querySelector('#UpdateGeneratorPopUp');
    dialog.showModal();
    $("#updateButton").one('click', function () {
        updateSignalInformations(signalId);
        dialog.close();
    });
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
}

//Function to Hide Popup
function hide_popup() {
    $('#errorMsg').text("");
    $('#lastUnity').val("");
    $('#unityNewGenerateur').val("");
    document.getElementById('categoryNewgenerateur').selectedIndex = 0;
    $('#popupContent').css('display', 'none');
}

function createAndSetupInput() {
    var input = document.createElement('input');
    input.disabled = true;
    $(input).css('width', '50px');
    $(input).css('border-color', 'black');
    $(input).css('padding', '5px');
    $(input).css('height', '20px');
    return input;
}

function populateComboboxFromArray(comboboxId, array) {
    $('#' + comboboxId).append(data);

    for (i = 0; i < array.length; i++) {
        var data = '<option>' + array[i] + '</option>'
        $('#' + comboboxId).append(data);
    }
}
