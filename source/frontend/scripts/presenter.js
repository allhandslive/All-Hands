var serverUrl = "/";
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
        attributes: { name: getParameterByName("name"); }
    };
    
    if (document.getElementById("stVideo").checked) {
        options.video = true;
        options.screen = false;
        options.audio = false;
    } else if (document.getElementById("stScreen").checked) {
    
    } else if (document.getElementById("stAudio").checked) {
    
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
      var subscribeToStreams = function (streams) {
        for (var index in streams) {
          var stream = streams[index];
          if (localStream.getID() !== stream.getID()) {
            room.subscribe(stream);
          }
        }
      };

      room.addEventListener("room-connected", function (roomEvent) {

        room.publish(localStream, {maxVideoBW: 300});
        subscribeToStreams(roomEvent.streams);
      });

      room.addEventListener("stream-subscribed", function(streamEvent) {
        var stream = streamEvent.stream;
        var div = document.createElement('div');
        div.setAttribute("style", "width: 320px; height: 240px;");
        div.setAttribute("id", "test" + stream.getID());

        document.body.appendChild(div);
        stream.show("test" + stream.getID());

      });

      room.addEventListener("stream-added", function (streamEvent) {
        var streams = [];
        streams.push(streamEvent.stream);
        subscribeToStreams(streams);
      });

      room.addEventListener("stream-removed", function (streamEvent) {
        // Remove stream from DOM
        var stream = streamEvent.stream;
        if (stream.elementID !== undefined) {
          var element = document.getElementById(stream.elementID);
          document.body.removeChild(element);
        }
      });

      room.connect();

      localStream.show("myVideo");

    });
    localStream.init();
  });
}
