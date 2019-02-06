const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
    }
    #controls {
      display: none;
    }
    ul {
      list-style-type: none;
    }
  </style>
  <div id="movie-player">
    <video id="video" width="100%" height="400" controls preload="metadata" poster="bear.png">
      <source src="movie.mp4" type="video/mp4">
      Your browser does not support the video tag.
      <object width="100%" height="400" data="movie.mp4"></object>
    </video>
    <ul id="controls">
      <li><button id="volume" type="button">Volume</button></li>
      <li><button id="skip-back" type="button">Rewind</button></li>
      <li><button id="toggle-play" type="button">Play/Pause</button></li>
      <li><button id="skip-forward" type="button">Fast Forward</button></li>
      <li><button id="fullscreen" type="button">Fullscreen</button></li>
      <li class="progress">
        <progress id="progress" value="0" min="0">
          <span id="progress-bar"></span>
        </progress>
      </li>
    </ul>
  </div>
`;

class VideoPlayer extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // check if browser supports HTML5 video
    const supportsMediaAPI = !!document.createElement('video').canPlayType;
    if (supportsMediaAPI) {
      // setup controls
      this._setupVideoControls();
    }
  }

  _setupVideoControls() {
    const moviePlayer = this.shadowRoot.querySelector('#movie-player');
    const volume = this.shadowRoot.querySelector('#volume');
    const rewind = this.shadowRoot.querySelector('#skip-back');
    const togglePlay = this.shadowRoot.querySelector('#toggle-play');
    const forward = this.shadowRoot.querySelector('#skip-forward');
    const fullscreen = this.shadowRoot.querySelector('#fullscreen');
    const video = this.shadowRoot.querySelector('#video');
    const controls = this.shadowRoot.querySelector('#controls');

    // hide default controls/show custom controls
    video.controls = false;
    controls.style.display = 'inline-block';
    // pause/play video
    togglePlay.addEventListener('click', (e) => {
      if (video.paused || video.ended) video.play();
      else video.pause();
    });

    // change to full screen mode
    const fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
    // don't show button if fullscreen mode is not supported
    if (!fullScreenEnabled) {
      fullscreen.style.display = 'none';
    }
    const isFullScreen = function() {
      return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
    }
    fullscreen.addEventListener('click', (e) => {
      if (isFullScreen()) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        setFullscreenData(false);
     }
     else {
        if (moviePlayer.requestFullscreen) moviePlayer.requestFullscreen();
        else if (moviePlayer.mozRequestFullScreen) moviePlayer.mozRequestFullScreen();
        else if (moviePlayer.webkitRequestFullScreen) moviePlayer.webkitRequestFullScreen();
        else if (moviePlayer.msRequestFullscreen) moviePlayer.msRequestFullscreen();
        setFullscreenData(true);
     }
    });
  }

}

window.customElements.define('video-player', VideoPlayer);