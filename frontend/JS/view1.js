var socket = io();
var generators = new Array();
var charts = new Array();


socket.emit('getAllSignals');

socket.on('newValue', function (newValue) {
    $('#' + newValue.signalId).find('.valueDisplay').val(newValue.value);
    updateSignalChart(newValue.signalId, newValue.value);
});

socket.on('signals', function (signals) {
    initializeOldSignal(signals);
});

$(function () {
    $(".generator").draggable({
        stack: ".draggable",
        cursor: 'hand',
        helper: 'clone'
    });


    $(".ui-drop").droppable({
        activeClass: 'ui-state-hover',
        accept: '.generator, .oldGenerator',
        drop: function (event, ui) {
            var dropZone = $(this);
            var generator = ui.draggable.clone();

            var valueDisplayer = createAndSetupInput();
            $(valueDisplayer).addClass("valueDisplay");
            $(generator).append(valueDisplayer);

            generator.css('position', 'absolute');
            generator.css('top', ui.position.top);
            generator.css('left', ui.position.left);
            generator.appendTo(dropZone);


            if ($(generator).hasClass('generator')) {
                setupNewGenerator(generator);

            }
            if ($(generator).hasClass('oldGenerator')) {
                setupOldGenerator(generator);
                ui.draggable.remove();
            }

            $(generator).click(function () {
                var currentGenerator = $(this);
                var generatorId = $(currentGenerator).attr('id');
                socket.on('signalInfos', function (generatorInfos) {
                    $('#valMin').val(generatorInfos.minValue);
                    $('#valMax').val(generatorInfos.maxValue);
                    document.getElementById('category').value = generatorInfos.category;
                });

                socket.emit('getSignalInfos', generatorId);
                $('#save').hide();
                $('#update').show();
                show_updatePopup(generatorId);
            });


        }
    });
});

function setupOldGenerator(generator) {
    var signalId = $(generator).attr('id');

    createSignalGraph(signalId);
}

function setupNewGenerator(generator) {


    $(generator).attr('id', generators.length + 1);
    var signalName = createAndSetupInput();
    $(signalName).addClass("signalName");
    $(generator).prepend(signalName);

    generators.push(generator);

    $('#save').show();
    $('#update').hide();
    show_popup($(generator).attr('id'));


}

function initializeOldSignal(signals) {

    for (var i = 0; i < signals.length; i++) {
        var signalName = createAndSetupInput();
        var generator = $('<div class="oldGenerator"><img src="../images/temperature.jpg" height="50px" width="50px"></div>');
        $("#draggableContentExisting").prepend(generator);
        generator.get(0).setAttribute("id", signals[i]._signalId);
        generator.draggable({
            stack: ".draggable",
            cursor: 'hand',
            helper: 'clone'
        });
        $(signalName).addClass("signalName");
        $(signalName).val(signals[i]._signalId);
        $(generator).prepend(signalName);
        generators.push(signals[i]._signalId);


    }
}


function createNewSignal() {
    if (validateFields()) {
        var signalId = $('#generatorName').val();
        createSignal(signalId);
        hide_popup();
        createSignalGraph(signalId);
    }

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

function updateSignal() {
    if (validateFields()) {
        var newSignalId = $('#generatorName').val();
        socket.emit("updateSignal",
            {
                signalId: newSignalId,
                valMin: $('#valMin').val(),
                valMax: $('#valMax').val(),
                category: $('#category').find(":selected").val()
            });
        updateSignalInfos(newSignalId);
        hide_popup();
    }
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
    if (categoryValue == "") {
        $('#errorMsg').text("Vous devez spécifier la catégorie du générateur");
    }
    else if (categoryValue != "binary" && (nameValue == "" || genValMin.value == "" || genValMax.value == "" )) {
        $('#errorMsg').text("Vous devez remplir tous les champs");
    }
    else if (categoryValue == "binary" && nameValue == "") {
        $('#errorMsg').text("Vous devez spécifier le nom du générateur");
    }
    else if (parseInt(genValMin.value) >= parseInt(genValMax.value)) {
        $('#errorMsg').text("La valeur minimale  de l'intervalle doit être inférieure à sa valeur maximale");
    }
    else {
        $('#errorMsg').text("");

        var newSignalId = $('#generatorName').val();
        updateSignalInfos(newSignalId);
        return true;
    }
}
//Function To Display Popup


function updateSignalInfos(newSignalId) {
    var signal = $('#droppableContent').get(0).lastChild;
    var oldId = $(signal).attr('id');


    $(signal).find('.signalName').val(newSignalId);
    $(signal).attr('id', newSignalId);

    var index = _.findIndex(charts, oldId + 'canvas');
    if (index != -1) {
        charts[index].id = newSignalId + 'canvas';
    }

}

function show_popup(generatorId) {
    $('#errorMsg').text("");
    $('#popupContent').css('display', 'block');
    $('#generatorName').val(generatorId);
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

function hide_gen() {
    $('.generator').css('display', 'none');
}

function createSignal(signalId, min, max, category) {

    socket.emit("createSignal",
        {
            signalId: signalId,
            valMin: $('#valMin').val(),
            valMax: $('#valMax').val(),
            category: $('#category option:selected').val()
        });
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
