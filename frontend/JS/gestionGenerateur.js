var socket = io();
var generators = new Array();
var charts = new Array();
var signalGet;


socket.emit('getAllSignals');

socket.on('newValue', function (newValue) {
    $('#' + newValue.signalId).find('.valueDisplay').val(newValue.value);
    updateSignalChart(newValue.signalId, newValue.value);
});

socket.on('signals', function (signals) {
    signalGet = signals;
    initializeOldSignal(signals);
});

socket.on('notDisplayedSignals', function(data){
    $('#generatorNameIdList option').remove();
    populateComboboxFromArray('generatorNameIdList', data)
});


$(function () {

    $(".generator").draggable({
        stack: ".draggable",
        cursor: 'hand',
        helper: 'clone',
        containment : '#droppableContent'
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


              if ($(generator).hasClass('generator')) {
                  setupNewGenerator(generator);
                  $(generator).removeClass('generator');
              }

              if ($(generator).hasClass('oldGenerator')) {
                  setupOldGenerator(generator);
                  ui.draggable.remove();
                  $(generator).removeClass('oldGenerator');
              }


            $(generator).draggable({
                stack: ".draggable",
                cursor: 'hand',
                containment : '#droppableContent',
                stop: function(event, ui) {
                    //mettre le code recuperer la position ici !!
                    alert("left="+parseInt($(this).position().left)+" top="+parseInt($(this).position().top));

                }
            });

            //event when click to generator
            $(generator).click(function () {
                var currentGenerator = $(this);
                var generatorId = $(currentGenerator).attr('id');
                socket.on('signalInfos', function (generatorInfos) {
                    $('#valMin').val(generatorInfos.minValue);
                    $('#valMax').val(generatorInfos.maxValue);
                    document.getElementById('category').value = generatorInfos.category;
                    $('#unity').val(generatorInfos.unity);
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
            helper: 'clone',
            containment : '#droppableContent'
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
                category: $('#category').find(":selected").val(),
                unity: $('#unity').val()
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
    var unityValue = document.getElementById('unity').value;

    if (categoryValue == "") {
        $('#errorMsg').text("Vous devez spécifier la catégorie du générateur");
    }
    else if (categoryValue != "binary" && (nameValue == "" || genValMin.value == "" || genValMax.value == ""
        || unityValue == "")) {
        $('#errorMsg').text("Vous devez remplir tous les champs");
    }
    else if (categoryValue == "binary" && (nameValue == "" || unityValue == "")) {
        $('#errorMsg').text("Vous devez spécifier le nom et/ou l'unité du générateur");
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
  /*
    $('#errorMsg').text("");
    $('#popupContent').css('display', 'block');
    $('#generatorName').val(generatorId);
    */
    socket.emit('getNotDisplayedSignalsId');
    $('#errorMsg').text("");
    var dialog = document.querySelector('#EnregistrerGeneratorPopUp');
    dialog.showModal();
    dialog.querySelector('.save').addEventListener('click', function() {
      //validateFields();
      $('#generatorName').val(generatorId);
      dialog.close();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });


}

//Function show_updatePopup
function show_updatePopup(generatorId) {
  /*
    $('#errorMsg').text("");
    $('#popupContent').css('display', 'block');
    $('#generatorName').val(generatorId);
    */
    $('#errorMsg').text("");
    var dialog = document.querySelector('#UpdateGeneratorPopUp');
    dialog.showModal();
    dialog.querySelector('.save').addEventListener('click', function() {
      $('#generatorName').val(generatorId);
      dialog.close();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });
}

//Function to Hide Popup
function hide_popup() {
    $('#errorMsg').text("");
    $('#valMin').val("");
    $('#valMax').val("");
    $('#unity').val("");
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
            category: $('#category option:selected').val(),
            unity: $('#unity').val()
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

function populateComboboxFromArray(comboboxId, array) {
    $('#' + comboboxId).append(data);

    for (i = 0; i < array.length; i++) {
        var data = '<option>' + array[i] + '</option>'
        $('#' + comboboxId).append(data);
    }
}
