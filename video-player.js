const template = document.createElement('template');
template.innerHTML = `
  <video width="100%" height="400" controls preload="metadata" poster="bear.png">
    <source src="movie.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
`;

class VideoPlayer extends HTMLElement {

  constructor(){
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

}

window.customElements.define('video-player', VideoPlayer);