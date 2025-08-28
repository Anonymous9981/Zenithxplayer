document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL STATE MANAGEMENT ---
    const G_STATE = {
        ytPlayer: null,
        queue: [],
        likedSongs: [],
        currentSongIndex: -1,
        songForModal: null,
        user: null,
        isFetching: false,
        activeScreen: 'home'
    };

    // --- DOM ELEMENTS ---
    const mainContent = document.querySelector('main');
    const footer = document.querySelector('footer');
    const nav = document.querySelector('nav');
    const modalContainer = document.getElementById('song-options-modal');

    // --- AUTHENTICATION (NETLIFY IDENTITY) ---
    const identity = window.netlifyIdentity;
    if (identity) {
        identity.on('init', user => {
            G_STATE.user = user;
            renderUI(); // Initial render based on login state
            if (user) fetchUserData();
        });
        identity.on('login', user => {
            G_STATE.user = user;
            identity.close();
            fetchUserData().then(renderUI); // Fetch data, then render the full app
        });
        identity.on('logout', () => {
            if (G_STATE.ytPlayer && typeof G_STATE.ytPlayer.stopVideo === 'function') G_STATE.ytPlayer.stopVideo();
            // Reset state completely on logout
            Object.assign(G_STATE, { user: null, queue: [], likedSongs: [], currentSongIndex: -1, activeScreen: 'home' });
            renderUI(); // Render the login screen
        });
    }

    // --- DATA SYNC (FIRESTORE) ---
    async function fetchUserData() {
        if (!G_STATE.user || G_STATE.isFetching) return;
        G_STATE.isFetching = true;
        try {
            const token = G_STATE.user.token.access_token;
            const response = await fetch('/.netlify/functions/firestore', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch user data');
            const data = await response.json();
            G_STATE.queue = data.queue || [];
            G_STATE.likedSongs = data.likedSongs || [];
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            G_STATE.isFetching = false;
            // Re-render after fetching data to show user's playlists
            if(G_STATE.user) showScreen(G_STATE.activeScreen);
        }
    }

    async function saveData(dataType) {
        if (!G_STATE.user) return;
        const action = dataType === 'queue' ? 'saveQueue' : 'saveLikedSongs';
        const payload = G_STATE[dataType];
        try {
            const token = G_STATE.user.token.access_token;
            await fetch('/.netlify/functions/firestore', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, payload })
            });
        } catch (error) {
            console.error(`Error saving ${dataType}:`, error);
        }
    }

    // --- CORE APP RENDERING ---
    function renderUI() {
        if (G_STATE.user) {
            // User is logged in, show the full app
            nav.classList.remove('hidden');
            footer.classList.remove('hidden');
            renderFooter();
            renderNav();
            showScreen('home'); // Always start on home screen after login
        } else {
            // User is logged out, show the login screen
            nav.classList.add('hidden');
            footer.classList.add('hidden');
            mainContent.innerHTML = getLoginScreenHTML();
            document.getElementById('login-button').addEventListener('click', () => identity.open());
        }
    }

    // --- SCREEN MANAGEMENT & HTML TEMPLATES ---
    function showScreen(screenId) {
        G_STATE.activeScreen = screenId;
        const templates = {
            home: getHomeScreenHTML,
            queue: getQueueScreenHTML,
            liked: getLikedSongsScreenHTML,
            profile: getProfileScreenHTML
        };
        mainContent.innerHTML = templates[screenId] ? templates[screenId]() : `<h1>Not Found</h1>`;
        bindScreenEvents(screenId);
        renderNav();
    }
    
    function getLoginScreenHTML() {
        return `
            <div class="flex flex-col items-center justify-center h-full text-center p-4">
                <div class="w-24 h-24 rounded-3xl glass-logo flex items-center justify-center mb-6">
                    <i class="fa-solid fa-headphones-simple text-5xl text-white"></i>
                </div>
                <h1 class="text-4xl font-bold mb-2">Welcome to ZenithX</h1>
                <p class="text-lg opacity-70 mb-8">Your personal music streaming experience.</p>
                <button id="login-button" class="w-full max-w-xs p-4 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition text-lg">
                    Login / Sign Up
                </button>
            </div>`;
    }

    function getHomeScreenHTML() {
        return `
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-2xl glass-logo flex items-center justify-center">
                        <i class="fa-solid fa-headphones-simple text-2xl text-white"></i>
                    </div>
                    <h1 class="text-2xl font-bold">ZenithX</h1>
                </div>
                <div id="theme-selector" class="flex items-center space-x-1 bg-card p-1 rounded-full shadow-inner"></div>
            </div>
            <div class="mb-6">
                <input id="search-input" type="text" placeholder="Search songs or artists..." class="w-full p-3 rounded-lg bg-card border-2 border-color focus:outline-none focus:border-primary transition">
                <button id="search-button" class="w-full mt-2 p-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition">Search</button>
            </div>
            <div id="search-results" class="space-y-3"></div>`;
    }

    function getQueueScreenHTML() {
        return `<h1 class="text-2xl font-bold mb-6">Up Next</h1><div id="queue-container" class="space-y-3"></div>`;
    }

    function getLikedSongsScreenHTML() {
        return `<h1 class="text-2xl font-bold mb-6">Liked Songs</h1><div id="liked-songs-container" class="space-y-3"></div>`;
    }

    function getProfileScreenHTML() {
        const userEmail = G_STATE.user ? G_STATE.user.email : 'Not Logged In';
        return `
            <h1 class="text-2xl font-bold mb-6">Profile</h1>
            <div class="bg-card p-4 rounded-lg shadow-custom">
                <p class="font-semibold">Current User:</p>
                <p class="text-sm opacity-70 mb-4 truncate">${userEmail}</p>
                <button id="logout-button" class="w-full p-3 bg-red-500 text-white rounded-lg font-semibold hover:opacity-90 transition">Logout</button>
            </div>`;
    }

    // --- UI COMPONENTS ---
    function renderFooter() {
        const currentSong = G_STATE.queue[G_STATE.currentSongIndex];
        const isLiked = currentSong && G_STATE.likedSongs.some(s => s.id.videoId === currentSong.id.videoId);
        footer.innerHTML = `
            <div class="flex items-center mb-3">
                <img id="current-song-thumbnail" src="${currentSong?.snippet.thumbnails.default.url || 'https://placehold.co/60x60/7c3aed/FFFFFF?text=ZX'}" class="w-14 h-14 rounded-lg mr-4 shadow-custom">
                <div class="flex-grow min-w-0">
                    <p id="current-song-title" class="font-semibold truncate">${currentSong?.snippet.title || 'No song playing'}</p>
                    <p id="current-song-artist" class="text-sm opacity-70 truncate">${currentSong?.snippet.channelTitle || (G_STATE.user ? 'Select a song' : 'Login to start')}</p>
                </div>
                <button id="like-button" class="p-2 ml-2 ${isLiked ? 'text-pink-500' : 'text-color opacity-50'} ${!currentSong ? 'hidden' : ''}"><i class="fas fa-heart fa-lg"></i></button>
            </div>
            <div class="progress-bar-container mb-3" id="progress-container"><div class="progress-bar" id="progress-bar"></div></div>
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
        bindFooterEvents();
    }

    function renderNav() {
        const navItems = [
            { id: 'home', icon: 'home', label: 'Home' },
            { id: 'queue', icon: 'list-music', label: 'Queue' },
            { id: 'liked', icon: 'heart', label: 'Liked' },
            { id: 'profile', icon: 'user', label: 'Profile' }
        ];
        nav.innerHTML = navItems.map(item => `
            <button data-screen="${item.id}" class="${G_STATE.activeScreen === item.id ? 'primary-color' : 'text-color'} p-2 flex flex-col items-center space-y-1 w-1/4">
                <i class="fas fa-${item.icon}"></i><span>${item.label}</span>
            </button>
        `).join('');
        nav.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => showScreen(btn.dataset.screen)));
    }
    
    function renderThemeSelector() {
        const themes = [
            { name: 'light', icon: 'sun', color: 'text-yellow-500' },
            { name: 'dark', icon: 'moon', color: 'text-blue-300' },
            { name: 'anime', icon: 'heart', color: 'text-pink-400' },
            { name: 'game', icon: 'gamepad', color: 'text-purple-400' }
        ];
        const selector = document.getElementById('theme-selector');
        if (!selector) return;
        selector.innerHTML = themes.map(theme => `
            <button data-theme="${theme.name}" title="${theme.name} Theme" class="w-8 h-8 rounded-full flex items-center justify-center ${theme.color} hover:bg-border-color transition-all duration-300"><i class="fas fa-${theme.icon}"></i></button>
        `).join('');
        selector.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => changeTheme(btn.dataset.theme)));
    }

    // --- EVENT BINDING ---
    function bindScreenEvents(screenId) {
        if (screenId === 'home') {
            document.getElementById('search-button').addEventListener('click', searchSongs);
            document.getElementById('search-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') searchSongs(); });
            renderThemeSelector();
        }
        if (screenId === 'queue') renderQueue();
        if (screenId === 'liked') renderLikedSongs();
        if (screenId === 'profile') {
            document.getElementById('logout-button').addEventListener('click', () => identity.logout());
        }
    }

    function bindFooterEvents() {
        document.getElementById('play-pause-button').addEventListener('click', togglePlayPause);
        document.getElementById('prev-button').addEventListener('click', playPreviousSong);
        document.getElementById('next-button').addEventListener('click', () => playNextSong(false));
        document.getElementById('progress-container').addEventListener('click', seek);
        const likeButton = document.getElementById('like-button');
        if (likeButton) likeButton.addEventListener('click', toggleLike);
    }

    // --- PLAYER LOGIC ---
    window.onYouTubeIframeAPIReady = () => {
        G_STATE.ytPlayer = new YT.Player('player', {
            height: '0', width: '0',
            events: { 'onStateChange': onPlayerStateChange }
        });
    };

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) updatePlayPauseIcon(true);
        if (event.data === YT.PlayerState.PAUSED) updatePlayPauseIcon(false);
        if (event.data === YT.PlayerState.ENDED) playNextSong(true);
    }

    function playSong(video, indexInQueue) {
        if (!G_STATE.ytPlayer || typeof G_STATE.ytPlayer.loadVideoById !== 'function') return;
        G_STATE.ytPlayer.loadVideoById(video.id.videoId);
        G_STATE.currentSongIndex = indexInQueue;
        G_STATE.ytPlayer.playVideo();
        renderFooter();
    }

    function togglePlayPause() {
        if (!G_STATE.ytPlayer || typeof G_STATE.ytPlayer.getPlayerState !== 'function' || G_STATE.currentSongIndex === -1) return;
        const state = G_STATE.ytPlayer.getPlayerState();
        if (state === YT.PlayerState.PLAYING) G_STATE.ytPlayer.pauseVideo();
        else G_STATE.ytPlayer.playVideo();
    }

    function updatePlayPauseIcon(isPlaying) {
        document.getElementById('play-icon')?.classList.toggle('hidden', isPlaying);
        document.getElementById('pause-icon')?.classList.toggle('hidden', !isPlaying);
    }

    function playNextSong(isAutoplay = false) {
        if (isAutoplay && G_STATE.currentSongIndex !== -1) {
            searchRelated(G_STATE.queue[G_STATE.currentSongIndex].id.videoId);
        } else if (G_STATE.queue.length > 0) {
            const nextIndex = (G_STATE.currentSongIndex + 1) % G_STATE.queue.length;
            playSong(G_STATE.queue[nextIndex], nextIndex);
        }
    }

    function playPreviousSong() {
        if (G_STATE.queue.length > 0) {
            const prevIndex = (G_STATE.currentSongIndex - 1 + G_STATE.queue.length) % G_STATE.queue.length;
            playSong(G_STATE.queue[prevIndex], prevIndex);
        }
    }
    
    function seek(e) {
        if (G_STATE.ytPlayer && typeof G_STATE.ytPlayer.seekTo === 'function' && G_STATE.currentSongIndex !== -1) {
            const bounds = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const width = e.currentTarget.clientWidth;
            const duration = G_STATE.ytPlayer.getDuration();
            if (duration > 0) G_STATE.ytPlayer.seekTo((x/width) * duration);
        }
    }

    setInterval(() => {
        if (G_STATE.ytPlayer && typeof G_STATE.ytPlayer.getCurrentTime === 'function' && G_STATE.currentSongIndex !== -1) {
            const currentTime = G_STATE.ytPlayer.getCurrentTime();
            const duration = G_STATE.ytPlayer.getDuration();
            if (duration > 0) {
                const progressBar = document.getElementById('progress-bar');
                const currentTimeEl = document.getElementById('current-time');
                const durationEl = document.getElementById('duration');
                if (progressBar) progressBar.style.width = (currentTime / duration) * 100 + '%';
                if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
                if (durationEl) durationEl.textContent = formatTime(duration);
            }
        }
    }, 1000);

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- THEME ---
    function changeTheme(theme) {
        document.body.className = 'bg-background text-color';
        if (theme === 'dark') document.body.classList.add('dark-theme');
        if (theme === 'anime') document.body.classList.add('anime-theme');
        if (theme === 'game') document.body.classList.add('game-theme');
    }
    
    // --- SEARCH ---
    async function searchSongs() {
        const input = document.getElementById('search-input');
        const resultsContainer = document.getElementById('search-results');
        if (!input || !resultsContainer) return;
        
        const query = input.value;
        if (!query) return;
        resultsContainer.innerHTML = `<p class="text-center opacity-70">Searching...</p>`;
        try {
            const response = await fetch(`/.netlify/functions/youtube?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            displaySearchResults(data.items);
        } catch (error) {
            resultsContainer.innerHTML = `<p class="text-center opacity-70">Could not fetch results.</p>`;
        }
    }

    async function searchRelated(videoId) {
        try {
            const response = await fetch(`/.netlify/functions/youtube?relatedToVideoId=${videoId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const nextSong = data.items[0];
                if (!G_STATE.queue.some(item => item.id.videoId === nextSong.id.videoId)) {
                    G_STATE.queue.push(nextSong);
                    saveData('queue');
                }
                const newIndex = G_STATE.queue.findIndex(item => item.id.videoId === nextSong.id.videoId);
                playSong(nextSong, newIndex);
            }
        } catch (error) { console.error("Error fetching related video:", error); }
    }

    function displaySearchResults(videos) {
        const resultsContainer = document.getElementById('search-results');
        if (!videos || videos.length === 0) {
            resultsContainer.innerHTML = `<p class="text-center opacity-70">No results found.</p>`;
            return;
        }
        resultsContainer.innerHTML = videos.map(video => getSongItemHTML(video)).join('');
        resultsContainer.querySelectorAll('.song-item').forEach(item => {
            const videoData = JSON.parse(item.dataset.video);
            item.querySelector('.song-info').addEventListener('click', () => handleSongClick(videoData));
            item.querySelector('.options-btn').addEventListener('click', () => openModal(videoData));
        });
    }
    
    function getSongItemHTML(video, context = 'search') {
        return `
            <div class="song-item flex items-center p-2 bg-card rounded-lg shadow-custom" data-video='${JSON.stringify(video)}'>
                <div class="song-info flex-grow flex items-center min-w-0 cursor-pointer">
                    <img src="${video.snippet.thumbnails.default.url}" class="w-12 h-12 rounded-md mr-4">
                    <div class="min-w-0">
                        <p class="font-semibold truncate">${video.snippet.title}</p>
                        <p class="text-sm opacity-70 truncate">${video.snippet.channelTitle}</p>
                    </div>
                </div>
                ${context === 'queue' ? `<button class="remove-btn p-2 text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>` : ''}
                <button class="options-btn p-2 text-color opacity-60 hover:opacity-100"><i class="fas fa-ellipsis-v"></i></button>
            </div>`;
    }

    function handleSongClick(video) {
        if (!G_STATE.user) {
            identity.open();
            return;
        }
        const indexInQueue = G_STATE.queue.findIndex(item => item.id.videoId === video.id.videoId);
        if (indexInQueue !== -1) {
            playSong(video, indexInQueue);
        } else {
            const newIndex = G_STATE.currentSongIndex + 1;
            G_STATE.queue.splice(newIndex, 0, video);
            playSong(video, newIndex);
            saveData('queue');
            if (G_STATE.activeScreen === 'queue') renderQueue();
        }
    }

    // --- QUEUE & LIKED SONGS ---
    function renderQueue() {
        const container = document.getElementById('queue-container');
        if (!container) return;
        if (G_STATE.queue.length === 0) {
            container.innerHTML = `<p class="text-center opacity-70">Your queue is empty.</p>`;
            return;
        }
        container.innerHTML = G_STATE.queue.map((video, index) => getSongItemHTML(video, 'queue')).join('');
        container.querySelectorAll('.song-item').forEach((item, index) => {
            const videoData = JSON.parse(item.dataset.video);
            item.querySelector('.song-info').addEventListener('click', () => playSong(videoData, index));
            item.querySelector('.remove-btn').addEventListener('click', () => removeFromQueue(index));
        });
    }

    function removeFromQueue(index) {
        G_STATE.queue.splice(index, 1);
        if (index === G_STATE.currentSongIndex) {
            G_STATE.ytPlayer.stopVideo();
            G_STATE.currentSongIndex = -1;
            renderFooter();
        } else if (index < G_STATE.currentSongIndex) {
            G_STATE.currentSongIndex--;
        }
        renderQueue();
        saveData('queue');
    }

    function renderLikedSongs() {
        const container = document.getElementById('liked-songs-container');
        if (!container) return;
        if (G_STATE.likedSongs.length === 0) {
            container.innerHTML = `<p class="text-center opacity-70">You haven't liked any songs yet.</p>`;
            return;
        }
        container.innerHTML = G_STATE.likedSongs.map(video => getSongItemHTML(video, 'liked')).join('');
        container.querySelectorAll('.song-item').forEach(item => {
            const videoData = JSON.parse(item.dataset.video);
            item.querySelector('.song-info').addEventListener('click', () => handleSongClick(videoData));
            item.querySelector('.options-btn').addEventListener('click', () => openModal(videoData));
        });
    }

    function toggleLike() {
        const song = G_STATE.queue[G_STATE.currentSongIndex];
        if (!song || !G_STATE.user) return;
        const indexInLiked = G_STATE.likedSongs.findIndex(s => s.id.videoId === song.id.videoId);
        if (indexInLiked !== -1) {
            G_STATE.likedSongs.splice(indexInLiked, 1);
        } else {
            G_STATE.likedSongs.unshift(song);
        }
        saveData('likedSongs');
        renderFooter();
        if (G_STATE.activeScreen === 'liked') renderLikedSongs();
    }

    // --- MODAL ---
    function openModal(video) {
        G_STATE.songForModal = video;
        modalContainer.classList.remove('hidden');
        modalContainer.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content bg-card">
                <h3 class="text-lg font-bold mb-4 truncate">${video.snippet.title}</h3>
                <button id="modal-add-to-queue" class="w-full text-left p-3 rounded-lg hover:bg-border-color transition flex items-center space-x-3">
                    <i class="fas fa-plus"></i><span>Add to Queue</span>
                </button>
                <button id="modal-cancel" class="w-full text-left p-3 mt-2 rounded-lg hover:bg-border-color transition flex items-center space-x-3">
                    <i class="fas fa-times"></i><span>Cancel</span>
                </button>
            </div>`;
        modalContainer.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        modalContainer.querySelector('#modal-cancel').addEventListener('click', closeModal);
        modalContainer.querySelector('#modal-add-to-queue').addEventListener('click', addToQueue);
    }

    function closeModal() {
        modalContainer.classList.add('hidden');
        G_STATE.songForModal = null;
    }

    function addToQueue() {
        if (G_STATE.songForModal && !G_STATE.queue.some(item => item.id.videoId === G_STATE.songForModal.id.videoId)) {
            G_STATE.queue.push(G_STATE.songForModal);
            saveData('queue');
            if (G_STATE.activeScreen === 'queue') renderQueue();
        }
        closeModal();
    }

    // Initial call to render the application
    renderUI();
});
