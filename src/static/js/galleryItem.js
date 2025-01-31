import * as settings  from "../settings.js";
import * as utils     from "./utils.js";

export class GalleryItem {
  thumbnail;
  id;
  name;
  description;
  authors;
  images;
  tags;
  center;
  stateMachine;

  constructor(
    gallery,
    infopanel,
    id,
    name,
    description,
    images,
    authors,
    tags,
    center,
    stateMachine
  ) {
    this.gallery = gallery;
    this.infopanel = infopanel;

    this.id = id;
    this.name = name;
    this.description = description;
    this.authors = authors;
    this.images = images;
    this.tags = tags;
    this.stateMachine = stateMachine;

    this.center = center;

    this.createThumbnail();
  }

  createThumbnail(){
  
    this.thumbnail = document.createElement("div");
    
    let tagTitles = this.tags.map(tag => tag.title);
    this.thumbnail.classList.add(... tagTitles);
    
    const thumbnailTitle = utils.stripHTML(this.name);
    
    this.thumbnail.innerHTML = `
              <div class="listItem" id="listItem_${this.id}">
                <div title='${thumbnailTitle}'  class="listItemImg" data-background-image-url="${utils.getImage(this.images[0])}"></div>
                <h3>${this.name}</h3>
              </div>
            `;

    this.thumbnail.addEventListener("click", (e) => this.setLocation());
    this.gallery.appendChild(this.thumbnail);
  }
  setLocation() {
    this.stateMachine.navigateTo(settings.get("STATES").INFO, this.id);
  }
  verifyState() {
    if (state.activeLocationId == this.id) {
      this.createPage();
    }
  }
  createPage() {
    
    const photoTitle = utils.stripHTML(this.name);

    this.infopanel.innerHTML = `
        <div class="header" id="header">
          <h1>${this.name}</h1>
        
        ${
          this.images.length > 1
            ? this.images
                .map(
                  (img, i) =>
                    `<img title='${photoTitle}' alt='${photoTitle}' src='${utils.getImage(img)}'/><span class='photoIndex'>${i + 1}/${
                      this.images.length
                    }</span>`
                )
                .join(" ")
            : `<img title='${photoTitle}' alt='${photoTitle}' src='${utils.getImage(this.images[0])}' />`
        }
        </div>
        <p class="description">
          ${this.description}
          ${this.authors.join(", ")}
        </p>
        <p class='tags'>
          ${this.tags.map((tag) => tag.getTagLocaleHTML()).join("")}
        </p>      
        <p>
          <a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${
            this.center[1]
          },${this.center[0]}" class="button">Google Maps</a>
        </p>
       
      `;
    this.infopanel.dataset.imagecarousel = "false";
    this.infopanel.dataset.image = 0;

    let _images = this.infopanel.querySelectorAll("img");
    if (_images.length <= 1) return;

    this.infopanel.dataset.imagecarousel = "true";

    let self = this;
    function nextImage() {
      let currentImage = parseInt(self.infopanel.dataset.image);
      let nextImage = currentImage + 1 < _images.length ? currentImage + 1 : 0;
      self.infopanel.dataset.image = nextImage;
    }

    _images.forEach((image) => image.addEventListener("click", nextImage));
  }
  show() {
    this.thumbnail.style.display = "block";
  }
  hide() {
    this.thumbnail.style.display = "none";
  }
}
