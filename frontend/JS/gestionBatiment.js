

var socket = io();

socket.emit('getComapgniesName');

socket.on('batimentAjouterOk', function () {
    PopUpCreerSucess();
});

socket.on('compagnie', function (data) {
    populateComboboxFromArray('CompagnieListbox', data)
});

socket.on('batimentsName', function (data) {
    $('#batimentListbox option').remove();
    populateComboboxFromArray('batimentListbox', data)
});

socket.on('batimentsInfos', function(data){
    console.log(data);
})

$(function () {
    $('#CompagnieListbox').change(function () {
        socket.emit('getCompagnieBatiment', $(this).find('option:selected').val());
    });
});

function searchBatimentGenerator() {

    socket.emit('searchBatimentsValues', {
        compagnie: $('#CompagnieListbox option:selected').text(),
        NomBatiment: $('#batimentListbox option:selected').text()
    });
}

function CreateBatiment() {

    socket.emit('ajouterBatiment', {
        compagnie: $('#compagnie').val(),
        nomBatiment: $('#batiment').val(),
        nbEtages: $('#nbEtages').val(),
        adresse: $('#adresse').val(),
        codePostal: $('#codePostal').val(),
        numero: $('#numero').val()
    });
}

function PopUpCreerSucess() {
    var dialog = document.querySelector('#SuccessPopUp');
    dialog.showModal();
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
}

function populateComboboxDateFromArray(comboboxId, array) {
    ///ANGE
}





function populateBatimentValuesTable(batimentValues) {

    $("#tableBatiment tr").remove(); //remove previous search data
    var table = document.getElementById("tableBatiment");
    //show element first table (id, cat, oldVolume, newVolume)
    for (var j = 0; j < batimentValues.length; j++) {
        //inserting table content by incrementing all the element into the arraylist

        var row = table.insertRow(table.rows.length);

        //A MODIFIER
        row.insertCell(0).innerHTML = batimentValues[j].Compagnie;
        row.insertCell(1).innerHTML = batimentValues[j].NomBatiment;
        row.insertCell(2).innerHTML = batimentValues[j].signal.MinValue;
        row.insertCell(3).innerHTML = batimentValues[j].Adressse;
        row.insertCell(4).innerHTML = batimentValues[j].Etage;
        row.insertCell(5).innerHTML = batimentValues[j].NbCapteur;

    }

}


function populateComboboxFromArray(comboboxId, array) {
    var data = '<option></option>'
       $('#' + comboboxId).append(data);

    for (i = 0; i < array.length; i++) {
        var data = '<option>' + array[i] + '</option>'
        $('#' + comboboxId).append(data);
    }
}


function ValidateField() {
    debugger;
    if ($("#compagnie").val() == "" || $("#batiment").val() == "") {
        $("#addBatimentButton").attr('disabled', true);
    } else if ($("#compagnie").val() != "" && $("#batiment").val() != "") {
        $("#addBatimentButton").attr('disabled', false);
    }
}
