function submit() {
    document.getElementById('message').innerHTML = "";
    if (!document.getElementById('certificateDisplayName').value) {
        document.getElementById('message').innerHTML += "<p>A valid Display Name is required.</p>";
    }
    // build JSON
    var content = {};
    content.PayloadDisplayName = document.getElementById('certificateDisplayName').value;
    content.PayloadDescription = document.getElementById('certificateDescription').value;
    content.PayloadOrganization = document.getElementById('certificateOrganisation').value;
    content.PayloadVersion = document.getElementById('versionNumber').value;

    ajax("http://localhost:3000/api/certificate_settings",
        "http://localhost:3000/generate/certificate/upload", "POST", content);
}
