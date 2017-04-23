function populateComboboxDateFromArray(comboboxId, array){
  ///ANGE
}


function SearchBatimentGenerator(){

  var compagnie = $('#CompagnieListbox option:selected').text();
  var batiment = $('#BatListbox option:selected').text();
  var adresse = $('#AdressListbox option:selected').text();


  socket.emit('searchBatimentValues', compagnie, batiment, adresse);
}


function populateBatimentValuesTable(batimentValues) {

  $("#tableBatiment tr").remove(); //remove previous search data
    var table = document.getElementById("tableBatiment");
  //show element first table (id, cat, oldVolume, newVolume)
  for(var j =0; j < batimentValues.length; j++)
  {
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

var socket = io();

socket.emit('getComapgniesName');

socket.on('batimentAjouterOk',function(){
  PopUpCreer();
});

socket.on('compagnie', function(data){
    populateComboboxFromArray('compagnieList',data)
});

socket.on('batimentsName', function(data){
    populateComboboxFromArray('batimentListbox',data)
});

$(function(){
    $('#compagnieList').change(function() {
        socket.emit('getCompagnieBatiment', $(this).find('option:selected').val());
    });
});

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

function PopUpCreer(){
  var dialog = document.querySelector('#SuccessPopUp');
  dialog.showModal();
  dialog.querySelector('.close').addEventListener('click', function() {
    dialog.close();
  });
}


function populateComboboxFromArray(comboboxId, array) {
    var data = '<option></option>'
    $('#' + comboboxId).append(data);

    for (i = 0; i < array.length; i++) {
        var data = '<option>' + array[i] + '</option>'
        $('#' + comboboxId).append(data);
    }
}


function ValidateField(){
  debugger;
  if($("#compagnie").val() == "" || $("#batiment").val() == ""){
    $("#addBatimentButton").attr('disabled', true);
  } else if($("#compagnie").val() != "" && $("#batiment").val() != ""){
    $("#addBatimentButton").attr('disabled', false);
  }
}
