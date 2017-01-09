// Main Javascript file for mobileconfig generator

function checkEmail() {
    var email = {};
    email.address = document.getElementById('email').value;
    var atCount = 0;
    for (var i = 0; i < email.address.length; i++) {
        if(email.address[i] === '@') {
            atCount++;
            console.log(atCount);
        }
    }
    if(email.address === '') {
        document.getElementById('message').innerHTML = '<p>This needs a valid email address</p>';
    }
    else if(atCount !== 1) {
        document.getElementById('message').innerHTML = '<p>This needs a valid email address</p>';
    }
    else if(atCount === 1) {
        // post email
        ajax("http://localhost:3000/valid_email", "http://localhost:3000/begin",
            "POST", email)
    }
}
function checkGeneralSettings() {
    document.getElementById('message').innerHTML = "";
    if (!document.getElementById('PayloadIdentifier').value) {
        document.getElementById('message').innerHTML += "<p>A valid Identifier is needed</p>";
        return;
    }
    // build JSON
    var content = {};
    content.PayloadDisplayName = document.getElementById('PayloadDisplayName').value;
    content.PayloadDescription = document.getElementById('PayloadDescription').value;
    content.PayloadOrganization = document.getElementById('PayloadOrganization').value;
    content.PayloadIdentifier = document.getElementById('PayloadIdentifier').value;

    ajax("http://localhost:3000/api/general_settings", "http://localhost:3000/generate",
        "POST", content);
}

// check enter pressed
function checkGeneralSubmit(e) {
    if(e && e.keyCode === 13) {
       checkGeneralSettings();
    }
}
function checkEmailSubmit(e) {
   if(e && e.keyCode === 13) {
      checkEmail();
   }
}

// restart
function continuePrevious() {
    window.location = "http://localhost:3000/begin";
}
function restart() {
    window.location = "http://localhost:3000/restart";
}

// shading for the hover over config type selection
function hover(x) {
    x.style.backgroundColor = "#bbbbbb";
}
function exit_hover(x) {
    x.style.backgroundColor = "#ffffff";
}

// navigation for generation
function addGenerate(type) {
    if (type === 'cert') {
        window.location = "http://localhost:3000/generate/certificate";
    } else if (type === 'email') {
        window.location = "http://localhost:3000/generate/email";
    } else if (type === 'wifi') {
        window.location = "http://localhost:3000/generate/wifi";
    }
}

function createProfile() {
    ajax("http://localhost:3000/api/create_profile",
        "http://localhost:3000/download", "GET", null);
}

function emailProfile() {
    ajax("http://localhost:3000/api/send_email",
        window.location, "GET", null);
}

function ajax(apiEndpoint, redirect, method, content) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState === 4 && req.status === 200) {
            window.location = redirect;
        }
    }
    req.open(method, apiEndpoint, true);
    if (method === "GET") {
        req.send();
    } else if (method === "POST") {
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(content));
    }
}
