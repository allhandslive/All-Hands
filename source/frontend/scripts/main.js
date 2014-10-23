var presentation = angular.module('Presentation', []);

presentation.directive('neScrollBottom', function() {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            if (scope.$last) {
                var element = elem[0];
                var parent = element.parentNode;

                var a = parent.scrollHeight - parent.offsetHeight - parent.scrollTop;

                if (a <= element.offsetHeight * 1.5) {
                    parent.scrollTop = parent.scrollHeight;
                }
            }
        }
    }
});

presentation.directive('nePlay', function() {
    return function(scope, element, attr) {
        scope.$watch(attr.nePlay, function neMutedWatchAction(value){
            if (value) {
                element[0].play();
            } else {
                element[0].pause();
            }
        });
    };
});

presentation.controller('MainController', function($scope, $sceDelegate, $sce) {
    var serverUrl = 'https://allhands.nweserver.com/';
    var avatarBaseUrl = 'https://avatarly.herokuapp.com/avatar?background_color=%2328b0e6&size=30&text=';
    var room;
    var dataStream;

    $scope.feeds = [];
    $scope.selectedVideo = null;
    $scope.selectedAudio = null;
    $scope.time = '';
    $scope.currentMessage = '';

    $scope.$safeApply = function(fn) {
        var phase = this.$root.$$phase;

        if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $scope.messages = [];

    $scope.videoPredicate = function(feed) {
        return feed.hasScreen ? 0 : 10;
    };

    $scope.viewerPredicate = function(feed) {
        return feed.isLocal ? 0 : 10;
    };

    $scope.selectFeed = function(id) {
        if (!$scope.selectedVideo || $scope.selectedVideo.id != id) {
            $scope.selectedVideo = _.find($scope.feeds, function(feed){ return feed.id == id; });
        }
    };

    $scope.messageKeyPress = function(evt) {
        if (evt.which === 13) {
            var message = {
                timestamp: Date.now(),
                text: $scope.currentMessage
            };

            dataStream.sendData(message);

            addMessage(message, dataStream);

            $scope.currentMessage = '';
        }
    };

    function init() {
        updateClock();
        setInterval(updateClock, 1000);

        getUserToken('Nathan');
    }

    function updateClock() {
        var currentTime = new Date();

        var currentHours = currentTime.getHours();
        var currentMinutes = currentTime.getMinutes();
        var currentSeconds = currentTime.getSeconds();

        // Pad the minutes and seconds with leading zeros, if required
        currentMinutes = (currentMinutes < 10 ? '0' : '') + currentMinutes;
        currentSeconds = (currentSeconds < 10 ? '0' : '') + currentSeconds;

        // Choose either 'AM' or 'PM' as appropriate
        var timeOfDay = (currentHours < 12) ? 'AM' : 'PM';

        // Convert the hours component to 12-hour format if needed
        currentHours = (currentHours > 12) ? currentHours - 12 : currentHours;

        // Convert an hours component of '0' to '12'
        currentHours = (currentHours == 0) ? 12 : currentHours;

        // Compose the string for display
        var currentTimeString = currentHours + ':' + currentMinutes + ':' + currentSeconds + ' ' + timeOfDay;

        // Update the time display
        $scope.$apply(function() {
            $scope.time = currentTimeString;
        });
    }

    function getUserToken(username) {
        var req = new XMLHttpRequest();
        var url = serverUrl + 'Token/' + username + '/viewerWithData';

        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                initRoom(req.responseText);
            }
        };

        req.open('GET', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send();
    }

    function addMessage(message, stream) {
        if (!message.text) return;

        if (stream) {
            var attributes = stream.getAttributes() || { };
            message.name = attributes.name;
            message.photo = avatarBaseUrl + attributes.name;
        }

        $scope.$safeApply(function() {
            $scope.messages.push(message);
        });
    }

    function addFeed(stream) {
        var attributes = stream.getAttributes() || { };

        var feed = {
            id: stream.getID(),
            name: stream.local ? 'You' : attributes.name,
            photo: avatarBaseUrl + attributes.name,
            hasScreen: stream.hasScreen(),
            hasVideo: stream.hasVideo() || stream.hasScreen(),
            hasAudio: stream.hasAudio(),
            hasData: stream.hasData(),
            isLocal: stream.local
        };

        if (feed.hasVideo || feed.hasScreen || feed.hasAudio) {
            var streamUrl = (window.URL || webkitURL).createObjectURL(stream.stream);
            feed.streamUrl = $sceDelegate.trustAs($sce.RESOURCE_URL, streamUrl);
        }

        if (feed.hasAudio) {
            feed.volume = .9;
        }

        if (feed.hasData) {
            stream.addEventListener('stream-data', function(evt) {
                addMessage(evt.msg, stream);
            });
        }

        $scope.$safeApply(function() {
            $scope.feeds.push(feed);

            if (!$scope.selectedVideo && (feed.hasVideo || feed.hasScreen)) {
                $scope.selectedVideo = feed;
            }

            if (!$scope.selectedAudio && feed.hasAudio) {
                $scope.selectedAudio = feed;
            }
        });
    }

    function initRoom(token) {
        room = Erizo.Room({ token: token });

        room.addEventListener('room-connected', function (roomEvent) {
            room.publish(dataStream);
            subscribeToStreams(roomEvent.streams);
        });

        room.addEventListener('stream-subscribed', function(streamEvent) {
            addFeed(streamEvent.stream);
        });

        room.addEventListener('stream-added', function (streamEvent) {
            if (dataStream.getID() !== streamEvent.stream.getID()) {
                subscribeToStreams(streamEvent.stream);
            }
        });

        room.addEventListener('stream-removed', function (streamEvent) {
            var stream = streamEvent.stream;
            var streamId = stream.getID();

            $scope.$apply(function() {
                $scope.feeds = _.reject($scope.feeds, function(feed){ return feed.id == streamId; });

                if ($scope.selectedVideo && $scope.selectedVideo.id == streamId) {
                    var firstVideoFeed = _.find($scope.feeds, function(feed){ return feed.hasVideo; });

                    if (firstVideoFeed) {
                        $scope.selectedVideo = firstVideoFeed;
                    } else {
                        $scope.selectedVideo = null;
                        // stop video
                    }
                }

                if ($scope.selectedAudio && $scope.selectedAudio.id == streamId) {
                    var firstAudioFeed = _.find($scope.feeds, function(feed){ return feed.hasAudio; });

                    if (firstAudioFeed) {
                        $scope.selectedAudio = firstAudioFeed;
                    } else {
                        $scope.selectedAudio = null;
                        // stop audio
                    }
                }
            });
        });

        initDataStream();
    }

    function initDataStream() {
        var attributes = {
            name: getParameterByName('name')
        };

        while (attributes.name === '') {
            attributes.name = prompt('Please enter your first and last names');
        }

        dataStream = Erizo.Stream({ audio: false, video: false, screen: false, data: true, attributes: attributes });

        dataStream.addEventListener('access-accepted', function () {
            addFeed(dataStream);
            room.connect();
        });

        dataStream.init();
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

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    window.onload = init;
});