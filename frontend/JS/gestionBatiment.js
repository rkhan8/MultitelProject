function populateSignalsValuesTable(signalsValues) {

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

function populateComboboxFromArray(comboboxId, array){
    var data = '<option></option>'
    $('#'+comboboxId).append(data);

    for (i = 0; i < array.length; i++) {
        var data = '<option>' + array[i] + '</option>'
        $('#'+comboboxId).append(data);
    }
}
