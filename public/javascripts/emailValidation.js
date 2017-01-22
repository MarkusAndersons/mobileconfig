window.onload = function() {
    $("#portNumberIn").val(143);
    $("#portNumberOut").val(25);
}

function incomingSSLClicked() {
    if ($("#portNumberIn").val() == 993)
        $("#portNumberIn").val(143);
    else
        $("#portNumberIn").val(993);
}
function outgoingSSLClicked() {
    if ($("#portNumberOut").val() == 465)
        $("#portNumberOut").val(25);
    else
        $("#portNumberOut").val(465);
}
var samePasswords = false;
function outgoingPasswordSameAsIncoming() {
    if (samePasswords) {
        $("#outgoingPasswordBlock").show();
        samePasswords = false;
    } else {
        $("#outgoingPasswordBlock").hide();
        samePasswords = true;
    }
}

function submit() {

}
