

function createAndSetupInput() {
    var input = document.createElement('input');
    input.disabled = true;
    $(input).css('width', '50px');
    $(input).css('border-color', 'black');
    $(input).css('padding', '5px');
    $(input).css('height', '20px');
    return input;
}

function initializePopupField(){
    $('.popUpField option').remove();
    $('.popUpCategoryField').val("");
}

function show_updatePopup(signalId) {
    initializePopupField();
    $('#lastSignalName').val(signalId);
    socket.emit('getComapgniesName');

    $('#removeSignalButton').click(function () {
        removeSignalFromDisplay(signalId);
        $( "#"+signalId+"canvas").remove();

    });
    $('#errorMsg').text("");
    var dialog = document.querySelector('#UpdateSignalPopUp');
    dialog.showModal();
    $("#updateButton").one('click', function () {
        updateSignalInformations(signalId);
        dialog.close();
    });
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
}

function updateSignalInformations(oldSignalId) {

    newSignalId = $('#lastSignalName').val();
    socket.emit("updateSignalInformations",
        {
            oldSignalId: oldSignalId,
            signalId: $('#lastSignalName').val(),
            category: $('#lastCategory').find(":selected").val(),
            unity: $('#lastUnity').val(),
            nomBatiment: $('#lastBatimentName').find(":selected").val(),
            compagnie: $('#lastCompagnie').find(":selected").val(),
            numeroEtage: $('#lastEtageNumber').find(":selected").val()

        });
    updateSignalInfos(newSignalId, oldSignalId);
    //   hide_popup();

}


