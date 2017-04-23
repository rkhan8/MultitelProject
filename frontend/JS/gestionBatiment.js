

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
    // les informations pour remplir le tableau pour le resultat de la recherche sont ici
    populateBatimentValuesTable(data);
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


//TABLE

//Sort filter for table1
var filterSort1 = function()
{
  $('#donneeBatiment').tablesorter({
       sortList: [[0, 0]]
    });
}


function populateBatimentValuesTable(batimentValues) {

    $("#tableBatiment tr").remove(); //remove previous search data
    var table = document.getElementById("tableBatiment");
    //show element first table (id, cat, oldVolume, newVolume)
    for (var j = 0; j < batimentValues.length; j++) {
        //inserting table content by incrementing all the element into the arraylist
        var row = table.insertRow(table.rows.length);

        row.insertCell(0).innerHTML = batimentValues[j].batimentId;
        row.insertCell(1).innerHTML = '<input id="compagnie" type="text" value="'+batimentValues[j].Compagnie+'"/>';
        row.insertCell(2).innerHTML = '<input id="batiment" type="text" value="'+batimentValues[j].NomBatiment+'"/>';
        row.insertCell(3).innerHTML = '<input id="adresse" type="text" value="'+batimentValues[j].Adresse+'"/>';
        row.insertCell(4).innerHTML = '<input id="codePostal" type="text" value="'+batimentValues[j].CodePostal+'"/>';
        row.insertCell(5).innerHTML = '<input id="NbEtage" type="text" value="'+batimentValues[j].NbEtages+'"/>';
        row.insertCell(6).innerHTML = '<a id="MAJbatimentButton" onclick="updateBatiment();" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored mdl-color-text--white">MAJ</a>'
        row.insertCell(7).innerHTML = '<a id="DeletebatimentButton" onclick="deleteBatiment();" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored mdl-color-text--white">Supprimer</a>'

    }

}


function updateBatiment(){

}

function deleteBatiment(){

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


function ValidateBatimentSearch() {
    debugger;
    if ($("CompagnieListbox").val() == "") {
        $("#batimentListbox").combobox('disabled');
    } else if ($("CompagnieListbox").val() != "") {
        $("#batimentListbox").combobox('enable');
    }
}
