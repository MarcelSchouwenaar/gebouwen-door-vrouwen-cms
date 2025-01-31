import * as settings from "../settings.js";

 
export class StateMachine {
  prevZoom;
  prevCenter;
  self;
  activeId;
  map;
  filterEvent = new Event("filterUpdate");
  navigationEvent = new Event("navigationUpdate");
  navigationDebounceTimeout = undefined;

  constructor(map) {
    this.prevZoom = settings.get("MAPBOX_DEFAULT_ZOOM");
    this.prevCenter = settings.get("MAPBOX_CENTER");
    this.self = this;
    this.map = map;
    this.activeId = null;  
    // this.init();
  }
  init() {
    this.addEventListeners();
    this.go();
    return;
  }
  togglePanel(_state) {
    let body = document.body;

    let panel = document.getElementById("panel");
    let state = body.dataset.panel;

    if (_state) {
      body.dataset.panel = _state;
    } else {
      body.dataset.panel = state == "up" ? "down" : "up";
    }
    panel.scrollTop = 0;
  }
  addEventListeners() {
    let self = this;
    //user navigated back
    window.addEventListener("popstate", (e) => {
      self.go();
    });
    //user moved map
    this.map.on("moveend", (e) => {
      self.onMapMoveEnd();
    });
  }
  go() {
    let url = new URL(document.location);
    let self = this;

    let state = url.searchParams.get("state") || settings.get("STATES").LIST;
    state = parseInt(state);

    let id = url.searchParams.get("id") || null;
    id = parseInt(id);

    if (id) {
      this.activeId = id;
    } else {
      this.activeId = null;
    }

    switch (state) {
      case settings.get("STATES").INFO:
        document.body.dataset.state = "info";
        break;
      case settings.get("STATES").MENU:
        document.body.dataset.state = "menu";
        break;
      default:
        this.map.flyTo({
          center: this.prevCenter,
          zoom: this.prevZoom,
        });

        document.body.dataset.state = "list";
    }
    document.body.dispatchEvent(this.navigationEvent);
    
  }
  debounceNavigation(){
    const self = this;
    this.navigationDebounceTimeout = setTimeout(() => {
      clearTimeout(self.navigationDebounceTimeout);
      self.navigationDebounceTimeout = undefined;
    },1000);
  }
  navigateTo(newState, id) {
    
    if(this.navigationDebounceTimeout !== undefined) return; 
    
    this.debounceNavigation();
    
    let url = new URL(document.location);
    url.searchParams.set("state", newState);

    if (newState == settings.get("STATES").INFO && !!id) {
      this.prevCenter = this.map.getCenter();
      this.prevZoom = this.map.getZoom();
      url.searchParams.set("id", id);
    } else {
      url.searchParams.delete("id");
    }

    window.history.pushState({}, "", url);
    this.go();
  }

  onMapMoveEnd() {

    if (!this.activeId) {
      this.prevCenter = this.map.getCenter();
      this.prevZoom = this.map.getZoom();
    }
    document.body.dispatchEvent(this.filterEvent);
  }
}
