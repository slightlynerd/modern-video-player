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
      <li><button id="vol-minus" type="button">Vol-</button></li>
      <li><button id="vol-plus" type="button">Vol+</button></li>
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

    this._video = this.shadowRoot.querySelector('#video');
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
    // get UI controls
    const volPlus = this.shadowRoot.querySelector('#vol-plus');
    const volMinus = this.shadowRoot.querySelector('#vol-minus');
    const rewind = this.shadowRoot.querySelector('#skip-back');
    const togglePlayBtn = this.shadowRoot.querySelector('#toggle-play');
    const forward = this.shadowRoot.querySelector('#skip-forward');
    const fullscreenBtn = this.shadowRoot.querySelector('#fullscreen');
    const video = this.shadowRoot.querySelector('#video');
    const controls = this.shadowRoot.querySelector('#controls');

    // hide default controls/show custom controls
    video.controls = false;
    controls.style.display = 'flex';

    togglePlayBtn.addEventListener('click', this._playPauseVideo.bind(this));
    volPlus.addEventListener('click', this._toggleVolume.bind(this));
    volMinus.addEventListener('click', this._toggleVolume.bind(this));
    rewind.addEventListener('click', this._rewind.bind(this));
    forward.addEventListener('click', this._forward.bind(this));

    // detect for fullscreen mode support
    const fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

    // don't show button if fullscreen mode is not supported
    if (!fullScreenEnabled) {
      fullscreen.style.display = 'none';
    }
    else {
      fullscreenBtn.addEventListener('click', this._launchFullscreenMode.bind(this));
    }
  }

  _playPauseVideo() {
    // pause or play video
    if (this._video.paused || this._video.ended) this._video.play();
    else this._video.pause();
  }

  _launchFullscreenMode() {
    const moviePlayer = this.shadowRoot.querySelector('#movie-player');

    // check if already in fullscreen
    const isFullScreen = function() {
      return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
    }

    if (isFullScreen()) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      // setFullscreenData(false);
    }
    else {
      if (moviePlayer.requestFullscreen) moviePlayer.requestFullscreen();
      else if (moviePlayer.mozRequestFullScreen) moviePlayer.mozRequestFullScreen();
      else if (moviePlayer.webkitRequestFullScreen) moviePlayer.webkitRequestFullScreen();
      else if (moviePlayer.msRequestFullscreen) moviePlayer.msRequestFullscreen();
      // setFullscreenData(true);
    }
  }

  _toggleVolume(arg) {
    // get inner text from the button
    const btnText = arg.originalTarget.innerText;
    // get integer volume of the button
    const currentVolume = Math.floor(this._video.volume * 10) / 10;
    // conditionally check which button is clicked
    if (btnText === 'Vol+') {
      if (currentVolume < 1) this._video.volume += 0.1;
    }
    else if (btnText === 'Vol-') {
      if (currentVolume > 0) this._video.volume -= 0.1;
    }
  }

  _rewind() {
    return this._video.currentTime -= 3;
  }

  _forward() { 
    return this._video.currentTime += 5;
  }

}

window.customElements.define('video-player', VideoPlayer);