// Main Javascript file for mobileconfig generator

function checkEmail() {
    var email = {};
    email.address = document.getElementById('email').value;
    var atCount = 0;
    for (var i = 0; i < email.address.length; i++) {
        if(email.address[i] == '@') {
            atCount++;
            console.log(atCount);
        }
    }
    if(email.address == '') {
        document.getElementById('message').innerHTML = '<p>This needs a valid email address</p>';
    }
    else if(atCount != 1) {
        document.getElementById('message').innerHTML = '<p>This needs a valid email address</p>';
    }
    else if(atCount == 1) {
        // post email
        var newReq = new XMLHttpRequest();             // make new HTTP request
        newReq.onreadystatechange = function() {
            if (newReq.readyState==4 && newReq.status==200) {
                console.log('Sent to server');
                window.location = "http://localhost:3000/begin";
            }
        }
        newReq.open("POST", "http://localhost:3000/valid_email", true);
        newReq.setRequestHeader('Content-Type', 'application/json');
        newReq.send(JSON.stringify(email));
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

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            window.location = "http://localhost:3000/generate";
        }
    }
    req.open("POST", "http://localhost:3000/valid_general_settings", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(content));
}

// check enter pressed
function checkGeneralSubmit(e) {
    if(e && e.keyCode == 13) {
       checkGeneralSettings();
    }
}
function checkEmailSubmit(e) {
   if(e && e.keyCode == 13) {
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
    if (type == 'cert') {
        window.location = "http://localhost:3000/generate/certificate";
    } else if (type == 'email') {
        window.location = "http://localhost:3000/generate/email";
    } else if (type == 'wifi') {
        window.location = "http://localhost:3000/generate/wifi";
    }
}
