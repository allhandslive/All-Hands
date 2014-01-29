var viewer = (function(undefined) {
    var serverUrl = 'http://192.168.1.64:3001/';
    var room;
    
    function init() {
        getUserToken('nathan');
    }
    
    function getUserToken(username) {
        var req = new XMLHttpRequest();
        var url = serverUrl + 'createToken/';
        var body = { username: username, role: 'viewer' };
        
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                initRoom(req.responseText);
            }
        };
        
        req.open('POST', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(body));
    }
    
    function initRoom(token) {
        room = Erizo.Room({ token: token });
        
        room.addEventListener('room-connected', function (roomEvent) {
            subscribeToStreams(roomEvent.streams);
        });
        
        room.addEventListener('stream-subscribed', function(streamEvent) {
            var stream = streamEvent.stream;
            //stream.show('screen');
            console.log(stream.show);
            
            var streamUrl = (window.URL || webkitURL).createObjectURL(stream.stream);
            document.getElementById('screen').src = streamUrl;
        });
        
        room.addEventListener('stream-added', function (streamEvent) {
            subscribeToStreams(streamEvent.stream);
        });
        
        room.addEventListener('stream-removed', function (streamEvent) {
            //not implemented
        });
        
        room.connect(); 
    }
    
    function subscribeToStreams(streams) {
        if (Array.isArray(streams)) {
            var i = streams.length;
            
            while (i--) {
                room.subscribe(streams[i]);
            }
        } else {
            room.subscribe(streams);
        }
    }

    window.onload = init;

})();