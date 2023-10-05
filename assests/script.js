
//CONSTANTS

const music_container = document.querySelector("#song-cont");
const music_player = document.getElementById("audio-player");
const songCurrentTime = document.getElementById('song-time-start');
const songTotalTime = document.getElementById('song-total-time');
const volume_control = document.getElementById('sound-unmute');
var currentSongObj = {};
var defaultImage = "assets/images/defaultImage.gif";

//MAIN-LOGIC

window.addEventListener('load', bootUpApp);

function bootUpApp() {
    fetchAndRenderAllSections();
}

function fetchAndRenderAllSections() {

    fetch("assests/js/ganna.json").then(res => res.json()).then(res => {
        const { cardbox } = res;
        if (Array.isArray(cardbox) && cardbox.length) {
            cardbox.forEach((section) => {
                const { songsbox, songscards } = section;
                renderSection(songsbox, songscards);
            })
        }
    }).catch((err) => {
        console.error(err)
        alert("Data not found")
    })
}

function renderSection(title, songList) {
    const songsSection = makeSectionDom(title, songList);
    music_container.appendChild(songsSection);
}

function makeSectionDom(title, songList) {
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('dynamic-div');
    sectionDiv.style.marginBottom = "60px";
    sectionDiv.innerHTML = `
        <h2 class="sec-heading">${title}</h2>
        <div class ="song-flex">
        ${songList.map(songobj => buildSongCardDom(songobj)).join(" ")}
        </div >
    `
    return sectionDiv
}

function buildSongCardDom(songobj) {
    return `
    <div class="trending-songs" onclick="playSong(this)" data-songobj='${JSON.stringify(songobj)}'> 
        <div class="song-card">
            <img src="/${songobj.image_source}" alt="${songobj.song_name}">
                <img id="p-btn" src="https://a10.gaanacdn.com/gn_img/images/play_1621599900.png" class="play-button" alt="">
                    <h3>${songobj.song_name}</h3>
                </div>
        </div>
`
}

// MUSIC-PLAYER-FUNCTIONS

function playSong(songCard) {
    const songObj = JSON.parse(songCard.dataset.songobj);
    showLoadingOverlay();
    setAndPlayCurrentSong(songObj);

}

function setAndPlayCurrentSong(songObj) {
    currentSongObj = songObj;
    music_player.pause();
    music_player.src = songObj.quality.low;
    music_player.currentTime = 0;
    music_player.play();

    music_player.addEventListener('canplay', hideLoadingOverlay);

    updatePlayerUi(songObj);
}

function showLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'block';
}

function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'none';
}

// Add an event listener to hide the loading overlay when the player is paused or ended
music_player.addEventListener('pause', hideLoadingOverlay);
music_player.addEventListener('ended', hideLoadingOverlay);

function updatePlayerUi(songObj) {
    const song_img = document.getElementById('song-image');
    const song_name = document.getElementById('song-name');
    const song_play_svg = document.getElementById('song-play-svg');
    const song_pause_svg = document.getElementById('song-pause-svg');
    const song_play_btn = document.getElementById('song-play-btn');
    const music_unmute = document.getElementById('music-unmute')
    const music_mute = document.getElementById('music-mute')

    song_img.src = songObj.image_source;
    song_name.innerHTML = songObj.song_name;

    if (music_player.play()) {
        song_play_svg.style.display = 'none';
        song_pause_svg.style.display = 'block';
    }
    if (music_player.play()) {
        song_play_btn.addEventListener('click', () => {
            music_player.pause();
            song_play_svg.style.display = 'block';
            song_pause_svg.style.display = 'none';
        })
    }
    song_play_btn.addEventListener('dblclick', () => {
        music_player.play();
        song_play_svg.style.display = 'none';
        song_pause_svg.style.display = 'block';
    })

    volume_control.addEventListener('click', () => {
        music_player.volume = 0;
        music_unmute.style.display = 'block';
        music_mute.style.display = 'none';

    })
    volume_control.addEventListener('dblclick', () => {
        music_player.volume = 1;
        music_unmute.style.display = 'none';
        music_mute.style.display = 'block';
    })
}

//TIMER-UPDATE

music_player.addEventListener('timeupdate', updatePlayerTime);

function updatePlayerTime() {
    if (!music_player || music_player.paused) return;

    songCurrentTime.innerHTML = getTimeString(music_player.currentTime);

    if (!isNaN(music_player.duration)) {
        songTotalTime.innerHTML = getTimeString(music_player.duration);
    }
    else {
        songTotalTime.innerHTML = '00.00';
    }
}
function getTimeString(time) {
    return isNaN(music_player.duration) ? "0:00" :
        Math.floor(time / 60) + ":" + parseInt((((time / 60) % 1) * 60).toFixed(2));
}

//VOLUME-CONTROL-HIGH-LOW

const v_low = document.getElementById('v-low');
const v_med = document.getElementById('v-med');
const v_high = document.getElementById('v-high');
const update_volume = document.getElementById('update-volume');

v_low.addEventListener('click', (e) => {
    music_player.volume = 0.2;
    update_volume.innerHTML = e.target.innerHTML;
})

v_med.addEventListener('click', (e) => {
    music_player.volume = 0.6;
    update_volume.innerHTML = e.target.innerHTML;
})

v_high.addEventListener('click', (e) => {
    music_player.volume = 1;
    update_volume.innerHTML = e.target.innerHTML;
})