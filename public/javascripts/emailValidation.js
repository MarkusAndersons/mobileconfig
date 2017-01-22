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
        $("#outgoingPasswordBlock").val("");
        samePasswords = true;
    }
}

function submit() {
    document.getElementById('message').innerHTML = "";
    // verification
    var ok = true;
    if (!document.getElementById('emailDisplayName').value) {
        document.getElementById('message').innerHTML += "<p>A valid Display Name is required.</p>";
    }
    if (!document.getElementById('emailAddress').value) {
        document.getElementById('message').innerHTML += "<p>An email address is required.</p>";
    }
    if (!document.getElementById('incomingServer').value) {
        document.getElementById('message').innerHTML += "<p>A valid incoming server is required.</p>";
    }
    if (!document.getElementById('incomingUsername').value) {
        document.getElementById('message').innerHTML += "<p>A username is required for the incoming server.</p>";
    }
    if (!document.getElementById('incomingPassword').value) {
        document.getElementById('message').innerHTML += "<p>A password is required.</p>";
    }
    if (!document.getElementById('outgoingServer').value) {
        document.getElementById('message').innerHTML += "<p>A valid outgoing server is required.</p>";
    }
    if (!document.getElementById('outgoingUsername').value) {
        document.getElementById('message').innerHTML += "<p>A username is required for the outgoing server.</p>";
    }
    if (!document.getElementById('outgoingSameAsIncoming').checked) {
        if (!document.getElementById('outgoingPassword').value) {
            document.getElementById('message').innerHTML += "<p>A password is required for the outgoing server.</p>";
        }
    }

    // build JSON
    var content = {};
    content.PayloadDisplayName = document.getElementById('emailDisplayName').value;
    content.EmailAccountDescription = document.getElementById('emailDescription').value;
    content.EmailAccountName = document.getElementById('userName').value;
    content.EmailAddress = document.getElementById('emailAddress').value;
    content.IncomingMailServerHostName = document.getElementById('incomingServer').value;
    content.IncomingMailServerPortNumber = document.getElementById('portNumberIn').value;
    content.IncomingMailServerUseSSL = document.getElementById('useSSLIncoming').checked;
    content.IncomingMailServerUsername = document.getElementById('incomingUsername').value;
    content.IncomingPassword = document.getElementById('incomingPassword').value;
    content.OutgoingPassword = document.getElementById('outgoingPassword').value;
    content.OutgoingPasswordSameAsIncomingPassword = document.getElementById('outgoingSameAsIncoming').checked;
    content.OutgoingMailServerHostName = document.getElementById('outgoingServer').value;
    content.OutgoingMailServerPortNumber = document.getElementById('portNumberOut').value;
    content.OutgoingMailServerUseSSL = document.getElementById('useSSLOutgoing').value;
    content.OutgoingMailServerUsername = document.getElementById('outgoingUsername').value;

    ajax("http://localhost:3000/api/email_settings",
        "http://localhost:3000/generate/", "POST", content);
}
