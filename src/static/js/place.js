import * as settings    from "../settings.js";
import * as utils       from "./utils.js";

import { Area }         from "./area.js";
import { Marker }       from "./marker.js";
import { Line }         from "./line.js";
import { GalleryItem }  from "./galleryItem.js";
import { TagSystem }    from "./tagsystem.js";

export class Place {
  id;
  description;
  map;
  images = [];
  tags = [];
  authors = [];
  place;
  center;
  location;
  gallery;
  galleryItem;
  infopanel;
  filter;
  tagSystem;
  stateMachine;

  constructor(
    location,
    map,
    gallery,
    infopanel,
    filter,
    stateMachine
  ) {
    this.location = location;
    this.map = map;
    this.gallery = document.getElementById(gallery);
    this.infopanel = document.getElementById(infopanel);
    this.filter = filter;
    this.tagSystem = new TagSystem();
    this.stateMachine = stateMachine;

    this.name = utils.wrapLanguageTags(this.location.properties.name);
    this.description = this.#getDescription();
    this.id = this.#createID();

    this.tags = this.#getTags();
    this.images = this.#getImages();
    this.autors = this.#getAuthors();

    this.icon = this.#getIcon();

    this.addPlace();

    this.addEventListeners();
    this.addGalleryItem();
  }

  #getAuthors() {
    return utils.getAuthors(
      this.location.properties.description,
      settings.DEFAULT_AUTHOR
    );
  }
  #getTags() {
    let allTags = utils.getHashTags(this.location.properties.description);
    let relevantTags = this.tagSystem.completeTagList(allTags);

    return relevantTags;
  }
  #getImages() {
    if (!this.location.properties.gx_media_links)
      return [settings.get("PLACEHOLDER_IMAGE")];
    if (this.location.properties.gx_media_links.length < 1)
      return [settings.get("PLACEHOLDER_IMAGE")];

    let _images = this.location.properties.gx_media_links;
    if (_images.indexOf(" ") > 0) {
      return this.location.properties.gx_media_links.split(" ");
    } else {
      return [this.location.properties.gx_media_links];
    }
  }
  #getDescription() {
    let desc = utils.wrapLanguageTags(this.location.properties.description)
    return utils.cleanText(desc);
  }
  #getIcon() {
    return this.tags[0].getIcon();
  }
  #createID() {
    return utils.getID(this.name + this.description);
  }
  addEventListeners() {
    let self = this;
    document.body.addEventListener("filterUpdate", (e) => self.verifyFilter());
    document.body.addEventListener("navigationUpdate", (e) =>
      self.verifyState()
    );
  }
  verifyState() {
    if (this.stateMachine.activeId == this.id) {
      this.showLocation();
      this.galleryItem.createPage();
      this.place.activate();
      return;
    }
    this.place.deactivate();
  }
  verifyFilter() {
    let match = false;
    match = this.checkTagFilter() && this.checkBoundariesFilter();

    if (match) {
      this.place.show();
      this.galleryItem.show();
    } else {
      this.place.hide();
      this.galleryItem.hide();
    }
  }

  addPlace() {
    if (this.location.geometry.type == "Polygon") {
      this.place = new Area(
        this.name,
        this.id,
        this.map,
        this.location,
        this.tags,
        this.stateMachine
      );
    } else if (this.location.geometry.type == "Point") {
      this.place = new Marker(
        this.id,
        this.map,
        this.location,
        this.icon,
        this.stateMachine
      );
    } else if (this.location.geometry.type == "LineString") {
      this.place = new Line(
        this.name,
        this.id,
        this.map,
        this.location,
        this.stateMachine
      );
    }
    this.center = this.place.getCenter();
  }

  addGalleryItem() {
    this.galleryItem = new GalleryItem(
      this.gallery,
      this.infopanel,
      this.id,
      this.name,
      this.description,
      this.images,
      this.authors,
      this.tags,
      this.center,
      this.stateMachine
    );
  }

  checkTagFilter() {
    let match = false;

    const self = this;
    const tagTitles = this.tags.map(tag => tag.title);

    this.filter.currentFilter.forEach(tag => {
      if (match) return;
      match = (tagTitles.indexOf(tag) >= 0);
    });

    return match;
  }

  checkBoundariesFilter() {
    //see if the location is within boundaries.
    let bounds = this.map.getBounds();
    let isInBounds = bounds.contains(this.center);
    return isInBounds;
  }

  showLocation() {
    
    if(this.location.geometry.type == "Polygon"){
       const bounds = this.place.getBoundaries();
       this.map.fitBounds(bounds, {padding: 20});
    } else {
       this.map.flyTo({center: this.center,zoom: settings.get("MAPBOX_DETAIL_ZOOM")});
    }
  }
}
