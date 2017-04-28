/**
 * Created by angem on 2017-04-25.
 */

function populateComboboxFromArray(comboboxId, array) {
    // $('#' + comboboxId).append(data);
    $('#' + comboboxId + ' option').remove();
    for (i = 0; i < array.length; i++) {
        var data = '<option>' + array[i] + '</option>'
        $('#' + comboboxId).append(data);
    }
}