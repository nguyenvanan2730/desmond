/**
 * Web Music Player Application
 * Main JavaScript functionality
 */

class MusicPlayer {
    constructor() {
        // Audio element
        this.audio = document.getElementById('audioPlayer');

        // State
        this.currentTrackIndex = -1;
        this.tracks = [];
        this.isPlaying = false;
        this.isShuffle = false;
        this.isRepeat = false;
        this.shuffleOrder = [];

        // DOM Elements - Controls
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.volumeBtn = document.getElementById('volumeBtn');

        // DOM Elements - Display
        this.progressBar = document.getElementById('progressBar');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.currentTimeDisplay = document.getElementById('currentTime');
        this.totalTimeDisplay = document.getElementById('totalTime');
        this.nowPlayingTitle = document.getElementById('nowPlayingTitle');
        this.nowPlayingArtist = document.getElementById('nowPlayingArtist');
        this.trackList = document.getElementById('trackList');
        this.trackCount = document.getElementById('trackCount');

        // DOM Elements - Icons
        this.playIcon = document.getElementById('playIcon');
        this.pauseIcon = document.getElementById('pauseIcon');
        this.volumeIcon = document.getElementById('volumeIcon');
        this.volumeMuteIcon = document.getElementById('volumeMuteIcon');

        // DOM Elements - States
        this.loadingState = document.getElementById('loadingState');
        this.emptyState = document.getElementById('emptyState');
        this.errorState = document.getElementById('errorState');

        // Initialize
        this.init();
    }

    init() {
        this.loadTracks();
        this.attachEventListeners();
        this.setVolume(70); // Default volume
    }

    // ===========================
    // Track Management
    // ===========================

    loadTracks() {
        try {
            // Check if MUSIC_TRACKS is defined (from tracks.js)
            if (typeof MUSIC_TRACKS === 'undefined') {
                throw new Error('Music tracks data not found');
            }

            this.tracks = MUSIC_TRACKS;

            if (this.tracks.length === 0) {
                this.showEmptyState();
            } else {
                this.renderTrackList();
                this.hideLoadingState();
            }

            this.trackCount.textContent = this.tracks.length;
        } catch (error) {
            console.error('Error loading tracks:', error);
            this.showErrorState();
        }
    }

    renderTrackList() {
        this.trackList.innerHTML = '';

        this.tracks.forEach((track, index) => {
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';
            trackItem.dataset.index = index;

            trackItem.innerHTML = `
                <div class="track-number">${index + 1}</div>
                <div class="track-info">
                    <span class="track-title">${this.escapeHtml(track.title)}</span>
                    <span class="track-artist">${this.escapeHtml(track.artist)}</span>
                </div>
                <div class="track-duration">${this.formatTime(track.duration)}</div>
            `;

            trackItem.addEventListener('click', () => this.playTrack(index));
            this.trackList.appendChild(trackItem);
        });
    }

    // ===========================
    // Playback Control
    // ===========================

    playTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;

        this.currentTrackIndex = index;
        const track = this.tracks[index];

        this.audio.src = track.url;
        this.audio.load();

        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.updatePlayPauseButton();
                this.updateNowPlaying();
                this.updateActiveTrack();
            })
            .catch((error) => {
                console.error('Playback error:', error);
                alert('Failed to play track. Please check the audio file URL.');
            });
    }

    togglePlayPause() {
        if (this.currentTrackIndex === -1) {
            // No track selected, play first track
            this.playTrack(0);
            return;
        }

        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play()
                .then(() => {
                    this.isPlaying = true;
                })
                .catch((error) => {
                    console.error('Playback error:', error);
                });
        }

        this.updatePlayPauseButton();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.updatePlayPauseButton();
    }

    playNext() {
        if (this.tracks.length === 0) return;

        let nextIndex;

        if (this.isShuffle) {
            const currentShuffleIndex = this.shuffleOrder.indexOf(this.currentTrackIndex);
            const nextShuffleIndex = (currentShuffleIndex + 1) % this.shuffleOrder.length;
            nextIndex = this.shuffleOrder[nextShuffleIndex];
        } else {
            nextIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        }

        this.playTrack(nextIndex);
    }

    playPrevious() {
        if (this.tracks.length === 0) return;

        // If more than 3 seconds into the track, restart current track
        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            return;
        }

        let prevIndex;

        if (this.isShuffle) {
            const currentShuffleIndex = this.shuffleOrder.indexOf(this.currentTrackIndex);
            const prevShuffleIndex = (currentShuffleIndex - 1 + this.shuffleOrder.length) % this.shuffleOrder.length;
            prevIndex = this.shuffleOrder[prevShuffleIndex];
        } else {
            prevIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        }

        this.playTrack(prevIndex);
    }

    // ===========================
    // Shuffle & Repeat
    // ===========================

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle('active', this.isShuffle);

        if (this.isShuffle) {
            this.generateShuffleOrder();
        }
    }

    generateShuffleOrder() {
        this.shuffleOrder = [...Array(this.tracks.length).keys()];

        // Fisher-Yates shuffle algorithm
        for (let i = this.shuffleOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shuffleOrder[i], this.shuffleOrder[j]] = [this.shuffleOrder[j], this.shuffleOrder[i]];
        }
    }

    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        this.repeatBtn.classList.toggle('active', this.isRepeat);
    }

    // ===========================
    // Volume Control
    // ===========================

    setVolume(value) {
        const volume = value / 100;
        this.audio.volume = volume;
        this.volumeSlider.value = value;
        this.updateVolumeIcon(volume);
    }

    toggleMute() {
        if (this.audio.volume > 0) {
            this.audio.dataset.previousVolume = this.audio.volume;
            this.setVolume(0);
        } else {
            const previousVolume = parseFloat(this.audio.dataset.previousVolume) || 0.7;
            this.setVolume(previousVolume * 100);
        }
    }

    updateVolumeIcon(volume) {
        if (volume === 0) {
            this.volumeIcon.style.display = 'none';
            this.volumeMuteIcon.style.display = 'block';
        } else {
            this.volumeIcon.style.display = 'block';
            this.volumeMuteIcon.style.display = 'none';
        }
    }

    // ===========================
    // Progress Bar
    // ===========================

    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressBar.value = progress;

            this.currentTimeDisplay.textContent = this.formatTime(this.audio.currentTime);
            this.totalTimeDisplay.textContent = this.formatTime(this.audio.duration);
        }
    }

    seekTo(value) {
        if (this.audio.duration) {
            const time = (value / 100) * this.audio.duration;
            this.audio.currentTime = time;
        }
    }

    // ===========================
    // UI Updates
    // ===========================

    updatePlayPauseButton() {
        if (this.isPlaying) {
            this.playIcon.style.display = 'none';
            this.pauseIcon.style.display = 'block';
            this.playPauseBtn.setAttribute('aria-label', 'Pause');
            this.playPauseBtn.setAttribute('title', 'Pause');
        } else {
            this.playIcon.style.display = 'block';
            this.pauseIcon.style.display = 'none';
            this.playPauseBtn.setAttribute('aria-label', 'Play');
            this.playPauseBtn.setAttribute('title', 'Play');
        }
    }

    updateNowPlaying() {
        if (this.currentTrackIndex >= 0 && this.currentTrackIndex < this.tracks.length) {
            const track = this.tracks[this.currentTrackIndex];
            this.nowPlayingTitle.textContent = track.title;
            this.nowPlayingArtist.textContent = track.artist;
        } else {
            this.nowPlayingTitle.textContent = 'No track selected';
            this.nowPlayingArtist.textContent = '';
        }
    }

    updateActiveTrack() {
        // Remove active class from all tracks
        const allTracks = this.trackList.querySelectorAll('.track-item');
        allTracks.forEach(item => {
            item.classList.remove('active', 'playing');
        });

        // Add active class to current track
        if (this.currentTrackIndex >= 0) {
            const activeTrack = this.trackList.querySelector(`[data-index="${this.currentTrackIndex}"]`);
            if (activeTrack) {
                activeTrack.classList.add('active');
                if (this.isPlaying) {
                    activeTrack.classList.add('playing');
                }
            }
        }
    }

    // ===========================
    // State Display
    // ===========================

    hideLoadingState() {
        this.loadingState.style.display = 'none';
        this.trackList.style.display = 'block';
    }

    showEmptyState() {
        this.loadingState.style.display = 'none';
        this.emptyState.style.display = 'block';
    }

    showErrorState() {
        this.loadingState.style.display = 'none';
        this.errorState.style.display = 'block';
    }

    // ===========================
    // Event Listeners
    // ===========================

    attachEventListeners() {
        // Control buttons
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.volumeBtn.addEventListener('click', () => this.toggleMute());

        // Sliders
        this.progressBar.addEventListener('input', (e) => this.seekTo(e.target.value));
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());

        this.audio.addEventListener('ended', () => {
            if (this.isRepeat) {
                // Repeat current track
                this.audio.currentTime = 0;
                this.audio.play();
            } else {
                // Play next track
                this.playNext();
            }
        });

        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayPauseButton();
            this.updateActiveTrack();
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayPauseButton();
            this.updateActiveTrack();
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.totalTimeDisplay.textContent = this.formatTime(this.audio.duration);
        });

        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            alert('Error loading or playing audio file. Please check the file URL.');
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    handleKeyboardShortcuts(e) {
        // Prevent shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT') return;

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.playNext();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.playPrevious();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const newVolumeUp = Math.min(100, parseInt(this.volumeSlider.value) + 10);
                this.setVolume(newVolumeUp);
                break;
            case 'ArrowDown':
                e.preventDefault();
                const newVolumeDown = Math.max(0, parseInt(this.volumeSlider.value) - 10);
                this.setVolume(newVolumeDown);
                break;
            case 'KeyM':
                e.preventDefault();
                this.toggleMute();
                break;
            case 'KeyS':
                e.preventDefault();
                this.toggleShuffle();
                break;
            case 'KeyR':
                e.preventDefault();
                this.toggleRepeat();
                break;
        }
    }

    // ===========================
    // Utility Functions
    // ===========================

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the music player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});
