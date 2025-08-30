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

document.addEventListener('DOMContentLoaded', function() {
    
    // First, try to get a reference to an existing player
    let player = videojs.getPlayer('my-video');

    // Check if the player has NOT been initialized yet
    if (!player) {
        // If no player exists, initialize it now WITH ALL YOUR OPTIONS
        player = videojs('my-video', {
            controls: true,
            autoplay: false,
            preload: 'auto',
            fluid: true,
            playbackRates: [0.5, 1, 1.5, 2],
            html5: {
                vhs: {
                    overrideNative: true,
                },
                nativeAudioTracks: false,
                nativeVideoTracks: false,
            },
            plugins: {
                // Enable the unified quality selector
                hlsQualitySelector: {
                    displayCurrentQuality: true,
                }
            }

        });
        console.log("Player initialized successfully!");
    } else {
        console.log("Player was already initialized.");
    }



    const loadButton = document.getElementById('load-video-btn');
    const sourceInput = document.getElementById('video-source-input');

    // --- Function to load a new video source ---
    const loadVideo = () => {
        const sourceUrl = sourceInput.value.trim(); // Get URL from input and remove whitespace
        
        // Check if a URL was actually entered
        if (!sourceUrl) {
            alert("Please enter a video source URL.");
            return;
        }
        
        // Heuristic to determine the video MIME type based on file extension
        let sourceType = '';
        if (sourceUrl.endsWith('.m3u8')) {
            sourceType = 'application/x-mpegURL'; // HLS
        } else if (sourceUrl.endsWith('.mpd')) {
            sourceType = 'application/dash+xml'; // DASH
        } else if (sourceUrl.endsWith('.mp4')) {
            sourceType = 'video/mp4'; // MP4
        } else {
            // If the type is unknown, we let Video.js try to figure it out.
            // This might not always work, but it's a good fallback.
            console.warn("Could not determine video type from URL. Letting Video.js guess.");
        }

        console.log(`Loading source: ${sourceUrl}`);
        console.log(`Detected type: ${sourceType || 'auto'}`);

        // Set the new source on the player
        player.src({
            src: sourceUrl,
            type: sourceType
        });

        // Load the new source and attempt to play it
        player.load();
        player.play().catch(error => {
            // Catch and log any errors that occur during playback attempt (e.g., autoplay restrictions)
            console.error("Playback was prevented:", error);
        });
    };

    // --- Event Listeners ---
    
    // Add a click event listener to the load button
    loadButton.addEventListener('click', loadVideo);
    
    // Optional: Allow pressing 'Enter' in the input field to load the video
    sourceInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission behavior
            loadVideo();
        }
    });
    
    // Pre-fill the input with a sample stream for demonstration
    sourceInput.value = 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8';
});