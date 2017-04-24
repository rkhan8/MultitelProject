
var socket = io();

socket.emit('getComapgniesName');


socket.on('compagnie', function (data) {
    populateComboboxFromArray('CompagnieListbox', data)
});

socket.on('batimentsName', function (data) {
    $('#batimentListbox option').remove();
    populateComboboxFromArray('BatimentListbox', data)
});

socket.on('batimentsEtage', function (data) {
    $('#batimentListbox option').remove();
    populateComboboxFromArray('EtageListbox', data)
});


socket.on('batimentsInfos', function(batimenInfos){
    var etages = new Array();
    for(var i = 0; i <= batimenInfos[0].NbEtages ; i++){
        etages.push(i);
    }

    $('#EtageListbox option').remove();
    populateComboboxFromArray('EtageListbox',etages);
});

$(function () {
    $('#CompagnieListbox').change(function () {
        socket.emit('getCompagnieBatiment', $(this).find('option:selected').val());
    });

    $('#BatimentListbox').change(function () {
        debugger;
        socket.emit('searchBatimentsValues', {
            NomBatiment: $(this).find('option:selected').val(),
            compagnie: $('#CompagnieListbox').find('option:selected').val()
        });
    });
});

function populateComboboxFromArray(comboboxId, array) {
    var data = '<option></option>'
    $('#' + comboboxId).append(data);

    for (i = 0; i < array.length; i++) {
        var data = '<option>' + array[i] + '</option>'
        $('#' + comboboxId).append(data);
    }
}


function findSignals()
{

}
