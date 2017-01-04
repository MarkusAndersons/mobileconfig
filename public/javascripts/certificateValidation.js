function submit() {
    var ok = true;
    document.getElementById('message').innerHTML = "";
    if (!document.getElementById('certificateDisplayName').value) {
        document.getElementById('message').innerHTML += "<p>A valid Display Name is required.</p>";
        return;
    }
    // build JSON
    var content = {};
    content.PayloadDisplayName = document.getElementById('certificateDisplayName').value;
    content.PayloadDescription = document.getElementById('certificateDescription').value;
    content.PayloadOrganization = document.getElementById('certificateOrganisation').value;
    content.PayloadVersion = document.getElementById('versionNumber').value;

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            window.location = "http://localhost:3000/generate/certificate/upload";
        }
    }
    req.open("POST", "http://localhost:3000/api/certificate_settings", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(content));
}
