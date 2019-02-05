const template = document.createElement('template');
template.innerHTML = `
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
    const volume = this.shadowRoot.querySelector('#volume');
    const rewind = this.shadowRoot.querySelector('#skip-back');
    const togglePlay = this.shadowRoot.querySelector('#toggle-play');
    const forward = this.shadowRoot.querySelector('#skip-forward');
    const fullscreen = this.shadowRoot.querySelector('#fullscreen');
    const video = this.shadowRoot.querySelector('#video');

    video.controls = false;
    togglePlay.addEventListener('click', function(e) {
      if (video.paused || video.ended) video.play();
      else video.pause();
    })
  }

}

window.customElements.define('video-player', VideoPlayer);