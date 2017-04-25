
function populateComboboxFromArray(comboboxId, array) {
   // $('#' + comboboxId).append(data);
    for (i = 0; i < array.length; i++) {
        var data = '<option>' + array[i] + '</option>'
        $('#' + comboboxId).append(data);
    }
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

function initializePopupField(){

    $('.popUpField option').remove();
    $('.popUpCategoryField').val("");
}


function show_updatePopup(signalId) {
    initializePopupField();
    socket.emit('getComapgniesName');

    $('#removeSignalButton').click(function () {
        removeSignalFromDisplay(signalId);
        $( "#"+signalId+"canvas").remove();

    });
    $('#errorMsg').text("");
    var dialog = document.querySelector('#UpdateGeneratorPopUp');
    dialog.showModal();
    $("#updateButton").one('click', function () {
        updateSignalInformations(signalId);
        dialog.close();
    });
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
}