// Copyright 2025 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function initPlayer() {
  var player = videojs('my-video');
  var PROJECT_NUMBER = '669648730623';
  var REGION = 'europe-west1';
  var NETWORK_CODE = '6353';
  var LIVE_STREAM_EVENT_ID = 'testchampart'
  var CUSTOM_ASSET_KEY = '669648730623-europe-west1-testchampart';

  var BACKUP_STREAM = 'https://storage.googleapis.com/testtopbox-public/video_content/bbb_cropped/playlist.m3u8';

  var videoElement = document.getElementsByTagName('video')[0];
  var streamManager = new google.ima.dai.api.StreamManager(videoElement);
  var clickElement = document.getElementById('ad-ui');
  streamManager.setClickElement(clickElement);
  streamManager.addEventListener([
      google.ima.dai.api.StreamEvent.Type.LOADED,
      google.ima.dai.api.StreamEvent.Type.ERROR,
      google.ima.dai.api.StreamEvent.Type.AD_BREAK_STARTED,
      google.ima.dai.api.StreamEvent.Type.STARTED,
      google.ima.dai.api.StreamEvent.Type.FIRST_QUARTILE,
      google.ima.dai.api.StreamEvent.Type.MIDPOINT,
      google.ima.dai.api.StreamEvent.Type.THIRD_QUARTILE,
      google.ima.dai.api.StreamEvent.Type.COMPLETE,
      google.ima.dai.api.StreamEvent.Type.AD_BREAK_ENDED
  ], function(event){
    switch (event.type) {
      case 'loaded': 
        console.log("stream ready to start => " + event.getStreamData().url);
        console.log("DAI session: " + event.getStreamData().streamId);
        // listen to ID3 tags and pass them to IMA for ad tracking
        player.textTracks().on('addtrack', function (e) {
          // find out if the new track is metadata
          var track = e.track;
          if (track.kind === 'metadata') {
            // a cuechange event fires when the player crosses over an ID3 tag
            track.on('cuechange', function () {
              let elemTrack = track.activeCues[0];
              if (elemTrack && elemTrack.value.data) {
                var metadata = {};
                metadata[elemTrack.value.key] = elemTrack.value.data;
                metadata["duration"] = Infinity;
                streamManager.onTimedMetadata(metadata);
              }
            });
          }
        });

        player.width(720); 
        player.height(480);
        player.src(event.getStreamData().url);
        // Start playback. This may be blocked by browser autoplay policies
        // if there hasn't been a user interaction yet.
        player.play().catch(function(error) {
          console.log('Playback was prevented:', error);
        });
      break;
      
      case 'error':
        console.log("Error => play fallback: " + BACKUP_STREAM);
        player.src(BACKUP_STREAM);
        //player.play();
      break;
      
    case 'adBreakStarted':
      console.log("ad break started => display ad ui element");
      clickElement.style.display = 'block';
    break;
    
    case 'adBreakEnded':
      console.log("ad break ended => hide ad ui element");
      clickElement.style.display = 'none';
    break;
    
    case 'started':
      console.log("ima event: " + event.type + " (" + event.getAd().getAdId() + ")");
    break;
    
    default:
      console.log("ima event: " + event.type);
    break;
    }
  }, false);

  var loadButton = document.getElementById('load-video-btn');
  loadButton.addEventListener('click', function() {
    // Request Live Stream
    var streamRequest = new google.ima.dai.api.VideoStitcherLiveStreamRequest();
    streamRequest.projectNumber = PROJECT_NUMBER;
    streamRequest.customAssetKey = CUSTOM_ASSET_KEY;
    streamRequest.apiKey = '';
    streamRequest.format = 'hls';
    streamRequest.networkCode = NETWORK_CODE;
    streamRequest.liveStreamEventId = LIVE_STREAM_EVENT_ID;
    streamRequest.region = REGION;
    streamRequest.oAuthToken = TOKEN;
    streamManager.requestStream(streamRequest);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initPlayer();
});
