

var socket = io();

socket.emit('getComapgniesName');

socket.on('batimentAjouterOk', function () {
    PopUpCreerSucess();
});

socket.on('batimentUpdated', function(){
    //afficher un popup pour dire que les informations du batiments ont bien été mises a jour
});

socket.on('compagnie', function (data) {
    data.unshift('');
    populateComboboxFromArray('CompagnieListbox', data)
});

socket.on('batimentsName', function (data) {
    data.unshift('');
    populateComboboxFromArray('batimentListbox', data)
});

socket.on('batimentsInfos', function(data){
    populateBatimentValuesTable(data);
});

$(function () {
    $('#CompagnieListbox').change(function () {
        socket.emit('getCompagnieBatiment', $(this).find('option:selected').val());
    });
});



function searchBatimentInformations() {
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
        row.insertCell(6).innerHTML = '<a class="majbatimentbutton mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored mdl-color-text--white">MAJ</a>'
        row.insertCell(7).innerHTML = '<a class="deletebatimentButton mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored mdl-color-text--white">Supprimer</a>'

    }
    $("#tableBatiment tr .majbatimentbutton").on('click', function(){
        updateBatiment($(this).closest('td').parent()[0].sectionRowIndex)

    });

    $("#tableBatiment tr .deletebatimentButton").on('click', function(){
        deleteBatiment($(this).closest('td').parent()[0].sectionRowIndex);

    });


}


function updateBatiment(numeroLigne){
    socket.emit('updateBatimentInfos',{
        batimentId:$('#tableBatiment').get(0).rows[numeroLigne].cells[0].innerHTML,
        compagnie:$('#tableBatiment').get(0).rows[numeroLigne].cells[1].children[0].value,
        nomBatiment: $('#tableBatiment').get(0).rows[numeroLigne].cells[2].children[0].value,
        adresse: $('#tableBatiment').get(0).rows[numeroLigne].cells[3].children[0].value,
        codePostal:$('#tableBatiment').get(0).rows[numeroLigne].cells[4].children[0].value,
        nombreEtages:$('#tableBatiment').get(0).rows[numeroLigne].cells[5].children[0].value
    });

}

function deleteBatiment(numeroLigne){
    socket.emit('deleteBatiment', $('#tableBatiment').get(0).rows[numeroLigne].cells[0].innerHTML);
    $('#tableBatiment').get(0).deleteRow(numeroLigne);
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



$(function () {

  $( "#SlideDownAddBatiment" ).click(function() {
    $( "#AddBatiment" ).slideToggle( "slow" );
  });

  $( "#SlideDownSearchBatiment" ).click(function() {
    $( "#search" ).slideToggle( "slow" );
  });
  
});
