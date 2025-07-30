<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>ZenithX Player</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-color: #3B82F6;
            --background-color: #f0f2f5;
            --text-color: #1F2937;
            --card-background: #ffffff;
            --border-color: #E5E7EB;
            --shadow-color: rgba(0, 0, 0, 0.1);
        }

        .dark-theme {
            --primary-color: #60A5FA;
            --background-color: #0f172a;
            --text-color: #e2e8f0;
            --card-background: #1e293b;
            --border-color: #334155;
            --shadow-color: rgba(0, 0, 0, 0.2);
        }
        
        .anime-theme {
            --primary-color: #f472b6;
            --background-color: #fdf2f8;
            --text-color: #831843;
            --card-background: #fce7f3;
            --border-color: #f9a8d4;
            --shadow-color: rgba(244, 114, 182, 0.1);
        }

        .game-theme {
            --primary-color: #8b5cf6;
            --background-color: #1e1b4b;
            --text-color: #e0e7ff;
            --card-background: #312e81;
            --border-color: #4f46e5;
            --shadow-color: rgba(139, 92, 246, 0.2);
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            transition: background-color 0.5s, color 0.5s;
            overscroll-behavior-y: contain;
        }

        .bg-background { background-color: var(--background-color); }
        .text-color { color: var(--text-color); }
        .bg-card { background-color: var(--card-background); }
        .border-color { border-color: var(--border-color); }
        .primary-color { color: var(--primary-color); }
        .bg-primary { background-color: var(--primary-color); }
        .shadow-custom { box-shadow: 0 4px 12px var(--shadow-color); }

        .progress-bar-container { height: 4px; background-color: var(--border-color); border-radius: 2px; cursor: pointer; }
        .progress-bar { height: 100%; background-color: var(--primary-color); border-radius: 2px; width: 0%; }
        .hidden { display: none; }

        /* Glassmorphism Logo */
        .glass-logo {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Modal styles */
        .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 40;
        }
        .modal-content {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 50;
            border-top-left-radius: 1.5rem;
            border-top-right-radius: 1.5rem;
            padding: 1.5rem;
            animation: slide-up 0.3s ease-out;
        }
        @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
    </style>
</head>
<body class="bg-background text-color">

    <div id="app" class="max-w-md mx-auto h-screen flex flex-col antialiased">

        <!-- Main Content -->
        <main id="home-screen" class="flex-grow p-4 overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-2xl glass-logo flex items-center justify-center">
                        <i class="fa-solid fa-headphones-simple text-2xl text-white"></i>
                    </div>
                    <h1 class="text-2xl font-bold">ZenithX</h1>
                </div>
                <div id="theme-selector" class="flex items-center space-x-2 bg-card p-1 rounded-full shadow-inner">
                    <button onclick="changeTheme('light')" title="Light Theme" class="w-8 h-8 rounded-full flex items-center justify-center text-yellow-500 hover:bg-border-color transition-all duration-300"><i class="fas fa-sun"></i></button>
                    <button onclick="changeTheme('dark')" title="Dark Theme" class="w-8 h-8 rounded-full flex items-center justify-center text-blue-300 hover:bg-border-color transition-all duration-300"><i class="fas fa-moon"></i></button>
                    <button onclick="changeTheme('anime')" title="Anime Theme" class="w-8 h-8 rounded-full flex items-center justify-center text-pink-400 hover:bg-border-color transition-all duration-300"><i class="fas fa-heart"></i></button>
                    <button onclick="changeTheme('game')" title="Game Theme" class="w-8 h-8 rounded-full flex items-center justify-center text-purple-400 hover:bg-border-color transition-all duration-300"><i class="fas fa-gamepad"></i></button>
                </div>
            </div>

            <div class="mb-6">
                <input id="search-input" type="text" placeholder="Search for songs..." class="w-full p-3 rounded-lg bg-card border-2 border-color focus:outline-none focus:border-primary transition">
                <button id="search-button" class="w-full mt-2 p-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition">Search</button>
            </div>

            <div id="search-results" class="space-y-3"></div>
        </main>
        
        <main id="playlist-screen" class="flex-grow p-4 overflow-y-auto hidden">
            <h1 class="text-2xl font-bold mb-6">My Playlist</h1>
            <div id="playlist-container" class="space-y-3"></div>
        </main>

        <main id="settings-screen" class="flex-grow p-4 overflow-y-auto hidden">
            <h1 class="text-2xl font-bold mb-6">Settings</h1>
            <div class="bg-card p-4 rounded-lg shadow-custom">
                <p>ZenithX Player v2.0</p>
                <p class="text-sm opacity-70 mt-2">Designed for a seamless mobile streaming experience.</p>
            </div>
        </main>

        <!-- Player Controls -->
        <footer class="bg-card p-4 border-t border-color shadow-custom">
            <!-- Player UI -->
        </footer>

        <!-- Navigation Bar -->
        <nav class="bg-card border-t border-color flex justify-around p-2">
            <!-- Nav Buttons -->
        </nav>
    </div>

    <!-- Song Options Modal -->
    <div id="song-options-modal" class="hidden">
        <div class="modal-backdrop" onclick="closeModal()"></div>
        <div class="modal-content bg-card">
            <h3 id="modal-song-title" class="text-lg font-bold mb-4 truncate"></h3>
            <button id="add-to-playlist-btn" class="w-full text-left p-3 rounded-lg hover:bg-border-color transition flex items-center space-x-3">
                <i class="fas fa-plus"></i>
                <span>Add to Playlist</span>
            </button>
            <button onclick="closeModal()" class="w-full text-left p-3 mt-2 rounded-lg hover:bg-border-color transition flex items-center space-x-3">
                <i class="fas fa-times"></i>
                <span>Cancel</span>
            </button>
        </div>
    </div>

    <!-- YouTube IFrame Player -->
    <div id="player" class="hidden"></div>
    
    <script>
        // --- STATE & DOM ELEMENTS ---
        let player;
        let playlist = [];
        let currentSongIndex = -1;
        let songForModal = null;

        const app = document.getElementById('app');
        const footer = app.querySelector('footer');
        const nav = app.querySelector('nav');
        const modal = document.getElementById('song-options-modal');
        const modalSongTitle = document.getElementById('modal-song-title');
        const addToPlaylistBtn = document.getElementById('add-to-playlist-btn');
        
        // --- INITIALIZATION ---
        function initializePlayer() {
            footer.innerHTML = `
                <div class="flex items-center mb-3">
                    <img id="current-song-thumbnail" src="https://placehold.co/60x60/7c3aed/FFFFFF?text=ZX" class="w-14 h-14 rounded-lg mr-4 shadow-custom">
                    <div>
                        <p id="current-song-title" class="font-semibold">No song playing</p>
                        <p id="current-song-artist" class="text-sm opacity-70">Select a song to start</p>
                    </div>
                </div>
                <div class="progress-bar-container mb-3" id="progress-container">
                    <div class="progress-bar" id="progress-bar"></div>
                </div>
                <div class="flex justify-between items-center text-xs opacity-70 mb-3">
                    <span id="current-time">0:00</span>
                    <span id="duration">0:00</span>
                </div>
                <div class="flex justify-center items-center space-x-6">
                    <button id="prev-button" class="p-2 text-color opacity-80 hover:opacity-100"><i class="fas fa-backward-step fa-2x"></i></button>
                    <button id="play-pause-button" class="p-4 bg-primary text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center">
                        <i id="play-icon" class="fas fa-play fa-2x"></i>
                        <i id="pause-icon" class="fas fa-pause fa-2x hidden"></i>
                    </button>
                    <button id="next-button" class="p-2 text-color opacity-80 hover:opacity-100"><i class="fas fa-forward-step fa-2x"></i></button>
                </div>`;

            nav.innerHTML = `
                <button onclick="showScreen('home-screen')" class="p-2 primary-color flex flex-col items-center space-y-1"><i class="fas fa-home"></i><span>Home</span></button>
                <button onclick="showScreen('playlist-screen')" class="p-2 text-color flex flex-col items-center space-y-1"><i class="fas fa-list-music"></i><span>Playlist</span></button>
                <button onclick="showScreen('settings-screen')" class="p-2 text-color flex flex-col items-center space-y-1"><i class="fas fa-cog"></i><span>Settings</span></button>`;
            
            // Re-bind event listeners after recreating the footer
            bindPlayerControls();
        }

        function bindPlayerControls() {
            document.getElementById('play-pause-button').addEventListener('click', togglePlayPause);
            document.getElementById('prev-button').addEventListener('click', () => playPreviousSong());
            document.getElementById('next-button').addEventListener('click', () => playNextSong(false));
            document.getElementById('progress-container').addEventListener('click', seek);
        }
        
        // --- THEME ---
        function changeTheme(theme) {
            const body = document.body;
            body.className = 'bg-background text-color';
            if (theme === 'dark') body.classList.add('dark-theme');
            if (theme === 'anime') body.classList.add('anime-theme');
            if (theme === 'game') body.classList.add('game-theme');
        }

        // --- NAVIGATION ---
        function showScreen(screenId) {
            ['home-screen', 'playlist-screen', 'settings-screen'].forEach(id => {
                document.getElementById(id).classList.add('hidden');
            });
            document.getElementById(screenId).classList.remove('hidden');

            nav.querySelectorAll('button').forEach(button => {
                button.classList.remove('primary-color');
                button.classList.add('text-color');
            });
            event.currentTarget.classList.add('primary-color');
        }

        // --- YOUTUBE API & PLAYER ---
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', { height: '0', width: '0', events: { 'onStateChange': onPlayerStateChange } });
        }
        function onPlayerStateChange(event) {
            if (event.data === YT.PlayerState.PLAYING) updatePlayPauseIcon(true);
            if (event.data === YT.PlayerState.PAUSED) updatePlayPauseIcon(false);
            if (event.data === YT.PlayerState.ENDED) playNextSong(true);
        }

        function togglePlayPause() {
            if (!player || typeof player.getPlayerState !== 'function' || currentSongIndex === -1) return;
            const state = player.getPlayerState();
            if (state === YT.PlayerState.PLAYING) player.pauseVideo();
            else player.playVideo();
        }

        function updatePlayPauseIcon(isPlaying) {
            document.getElementById('play-icon').classList.toggle('hidden', isPlaying);
            document.getElementById('pause-icon').classList.toggle('hidden', !isPlaying);
        }

        function playSong(video, indexInPlaylist) {
            if (!player || typeof player.loadVideoById !== 'function') return;
            player.loadVideoById(video.id.videoId);
            updatePlayerUI(video);
            currentSongIndex = indexInPlaylist;
            player.playVideo();
        }
        
        function playNextSong(isAutoplay = false) {
            if (isAutoplay && currentSongIndex !== -1) {
                searchRelated(playlist[currentSongIndex].id.videoId);
            } else if (playlist.length > 0) {
                const nextIndex = (currentSongIndex + 1) % playlist.length;
                playSong(playlist[nextIndex], nextIndex);
            }
        }
        
        function playPreviousSong() {
            if (playlist.length > 0) {
                const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
                playSong(playlist[prevIndex], prevIndex);
            }
        }

        function updatePlayerUI(video) {
            document.getElementById('current-song-thumbnail').src = video.snippet.thumbnails.high.url;
            document.getElementById('current-song-title').textContent = video.snippet.title;
            document.getElementById('current-song-artist').textContent = video.snippet.channelTitle;
        }

        setInterval(() => {
            if (player && typeof player.getCurrentTime === 'function' && currentSongIndex !== -1) {
                const currentTime = player.getCurrentTime();
                const duration = player.getDuration();
                if (duration > 0) {
                    document.getElementById('progress-bar').style.width = (currentTime / duration) * 100 + '%';
                    document.getElementById('current-time').textContent = formatTime(currentTime);
                    document.getElementById('duration').textContent = formatTime(duration);
                }
            }
        }, 1000);

        function seek(e) {
            if (player && typeof player.seekTo === 'function' && currentSongIndex !== -1) {
                const bounds = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - bounds.left;
                const width = e.currentTarget.clientWidth;
                const duration = player.getDuration();
                if (duration > 0) player.seekTo((x/width) * duration);
            }
        }
        
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }

        // --- SEARCH & API CALLS ---
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const searchResultsContainer = document.getElementById('search-results');
        
        searchButton.addEventListener('click', searchSongs);
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchSongs(); });

        async function searchSongs() {
            const query = searchInput.value;
            if (!query) return;
            searchResultsContainer.innerHTML = `<p class="text-center opacity-70">Searching...</p>`;
            try {
                const response = await fetch(`/.netlify/functions/youtube?q=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                displaySearchResults(data.items);
            } catch (error) {
                console.error("Error fetching search results:", error);
                searchResultsContainer.innerHTML = `<p class="text-center opacity-70">Could not fetch results. Please try again later.</p>`;
            }
        }
        
        async function searchRelated(videoId) {
            try {
                const response = await fetch(`/.netlify/functions/youtube?relatedToVideoId=${videoId}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    const nextSong = data.items[0];
                    if (!playlist.some(item => item.id.videoId === nextSong.id.videoId)) {
                        playlist.push(nextSong);
                        renderPlaylist();
                    }
                    const newIndex = playlist.findIndex(item => item.id.videoId === nextSong.id.videoId);
                    playSong(nextSong, newIndex);
                }
            } catch (error) { console.error("Error fetching related video:", error); }
        }

        function displaySearchResults(videos) {
            if (!videos || videos.length === 0) {
                searchResultsContainer.innerHTML = `<p class="text-center opacity-70">No results found.</p>`;
                return;
            }
            searchResultsContainer.innerHTML = '';
            videos.forEach(video => {
                const div = document.createElement('div');
                div.className = 'flex items-center p-3 bg-card rounded-lg shadow-custom cursor-pointer hover:bg-border-color transition';
                div.innerHTML = `
                    <img src="${video.snippet.thumbnails.default.url}" class="w-12 h-12 rounded-md mr-4" onclick='handleSongClick(${JSON.stringify(video)})'>
                    <div class="flex-grow" onclick='handleSongClick(${JSON.stringify(video)})'>
                        <p class="font-semibold truncate">${video.snippet.title}</p>
                        <p class="text-sm opacity-70">${video.snippet.channelTitle}</p>
                    </div>
                    <button class="options-btn p-2 text-color opacity-60 hover:opacity-100" onclick='openModal(${JSON.stringify(video)})'><i class="fas fa-ellipsis-v"></i></button>
                `;
                searchResultsContainer.appendChild(div);
            });
        }
        
        function handleSongClick(video) {
            const indexInPlaylist = playlist.findIndex(item => item.id.videoId === video.id.videoId);
            if (indexInPlaylist !== -1) {
                playSong(video, indexInPlaylist);
            } else {
                playlist.splice(currentSongIndex + 1, 0, video);
                const newIndex = currentSongIndex + 1;
                renderPlaylist();
                playSong(video, newIndex);
            }
        }
        // --- PLAYLIST MANAGEMENT ---
        const playlistContainer = document.getElementById('playlist-container');

        function renderPlaylist() {
            if (playlist.length === 0) {
                playlistContainer.innerHTML = `<p class="text-center opacity-70">Your playlist is empty. Add songs from the search results.</p>`;
                return;
            }
            playlistContainer.innerHTML = '';
            playlist.forEach((video, index) => {
                const div = document.createElement('div');
                div.className = 'flex items-center p-3 bg-card rounded-lg shadow-custom cursor-pointer hover:bg-border-color transition';
                div.innerHTML = `
                    <div class="flex-grow flex items-center" onclick='playSong(${JSON.stringify(video)}, ${index})'>
                        <img src="${video.snippet.thumbnails.default.url}" class="w-12 h-12 rounded-md mr-4">
                        <div>
                            <p class="font-semibold truncate">${video.snippet.title}</p>
                            <p class="text-sm opacity-70">${video.snippet.channelTitle}</p>
                        </div>
                    </div>
                    <button class="remove-btn p-2 text-red-400 hover:text-red-600" onclick='removeFromPlaylist(${index})'><i class="fas fa-trash"></i></button>
                `;
                playlistContainer.appendChild(div);
            });
        }

        function addToPlaylist() {
            if (songForModal && !playlist.some(item => item.id.videoId === songForModal.id.videoId)) {
                playlist.push(songForModal);
                renderPlaylist();
            }
            closeModal();
        }

        function removeFromPlaylist(index) {
            playlist.splice(index, 1);
            if (index === currentSongIndex) {
                player.stopVideo();
                updatePlayPauseIcon(false);
                currentSongIndex = -1;
            } else if (index < currentSongIndex) {
                currentSongIndex--;
            }
            renderPlaylist();
        }

        // --- MODAL ---
        function openModal(video) {
            songForModal = video;
            modalSongTitle.textContent = video.snippet.title;
            modal.classList.remove('hidden');
        }

        function closeModal() {
            modal.classList.add('hidden');
            songForModal = null;
        }
        
        addToPlaylistBtn.addEventListener('click', addToPlaylist);

        // --- SCRIPT LOADING ---
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        // --- INITIAL RENDER ---
        document.addEventListener('DOMContentLoaded', () => {
            initializePlayer();
            renderPlaylist();
        });
    </script>
</body>
</html>
