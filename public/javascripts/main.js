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

// restart
function continuePrevious() {
    window.location = "http://localhost:3000/begin";
}
function restart() {
    window.location = "http://localhost:3000/restart";
}
