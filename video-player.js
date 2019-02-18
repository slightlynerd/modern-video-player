class VideoPlayer extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._video = this.shadowRoot.querySelector('#video');
  }

  connectedCallback() {
    
  }

}

window.customElements.define('video-player', VideoPlayer);