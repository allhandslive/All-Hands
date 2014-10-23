var serverUrl = "https://allhands.nweserver.com/";
var localStream, room;

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function startStream() {
    document.getElementById("btnStart").disabled = 'disabled';

    var options = {
        videoSize: [1280, 720, 1280, 720],
        attributes: { name: getParameterByName("name") }
    };

    if (document.getElementById("stVideo").checked) {
        options.video = true;
        options.screen = false;
        options.audio = false;
    } else if (document.getElementById("stScreen").checked) {
        options.video = false;
        options.screen = true;
        options.audio = false;
    } else if (document.getElementById("stAudio").checked) {
        options.video = false;
        options.screen = false;
        options.audio = true;
    }

    localStream = Erizo.Stream(options);

    var createToken = function(userName, role, callback) {
        var req = new XMLHttpRequest();
        var url = serverUrl + 'Token/' + userName + '/' + role;

        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                callback(req.responseText);
            }
        };

        req.open('GET', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send();
    };

    createToken("user", "presenter", function (response) {
        var token = response;
        console.log(token);
        room = Erizo.Room({token: token});

        localStream.addEventListener("access-accepted", function () {
            room.addEventListener("room-connected", function (roomEvent) {
                room.publish(localStream);
            });

            room.connect();
        });

        localStream.init();
    });
}