import * as settings from "../settings.js";

export class Line {
  name;
  id;
  location;
  map;
  stateMachine;

  constructor(name, id, map, location, tags, stateMachine) {
    this.name = name;
    this.id = id;
    this.map = map;
    this.location = location;
    this.stateMachine = stateMachine;

    this.map.addSource(this.name, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: this.location.geometry,
      },
    });

    this.map.addLayer({
      id: "line_" + this.id,
      type: "line",
      source: this.name,
      layout: {},
      paint: {
        "line-color": settings.get("MAP_AREA_OUTLINE"),
        "line-width": 3,
      },
    });
    const self = this;
    this.map.on("click", "fill_" + this.id, (e) => this.setLocation(e));
  }

  getCenter() {
    let listX = this.location.geometry.coordinates.map((p) => p[0]);
    let centerX = (Math.max(...listX) + Math.min(...listX)) / 2;
    let listY = this.location.geometry.coordinates.map((p) => p[1]);
    let centerY = (Math.max(...listY) + Math.min(...listY)) / 2;
    return [centerX, centerY];
  }

  show() {
    this.map.setLayoutProperty("line_" + this.id, "visibility", "visible");
  }
  hide() {
    this.map.setLayoutProperty("line_" + this.id, "visibility", "none");
  }
  activate(){
    // console.log("activate line");
  }
  deactivate(){
    // console.log("deactivate line");
  }
  setLocation(e){
    let actualId = this.id;
    // let center = this.center;

    if (e.hasOwnProperty("originalEvent")) {
      //this is to catch an exception from Mapbox
      const el = e.originalEvent.target;
      if(el.classList.contains("marker")) actualId = el.id;
    }
   
    this.stateMachine.navigateTo(settings.get("STATES").INFO, actualId);
  }
}
