function populateSignalsValuesTable(signalsValues) {

}

var socket = io();
socket.on('batimentAjouterOk',function(){
  PopUpCreer();
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
