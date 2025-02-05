import * as settings from "../settings.js";

export class Marker{
  
  marker;
  icon;
  location;
  map;
  stateMachine;
  
  constructor(id, map, location, icon, stateMachine){
    
    this.id = id;
    this.map = map;
    this.stateMachine = stateMachine;
    
    this.marker = document.createElement("div");
    this.marker.id = this.id;
    this.marker.className = "marker";
  
    this.location = location;
    
    this.icon = icon;

    this.marker.innerHTML = this.icon;

    new mapboxgl.Marker(this.marker)
      .setLngLat(location.coordinates.coordinates)
      .addTo(this.map);
    
    const self = this;
    this.marker.addEventListener("click",e => this.setLocation(e));
  }
  getCenter(){
    return this.location.coordinates.coordinates;
  }
  show(){
    this.marker.style.display = "block";
  }
  hide(){
    this.marker.style.display = "none";
  }
  activate(){
    console.log("activating marker", this.location.title);
    this.marker.classList.add("marker_active");
  }
  deactivate(){
    console.log("deactivating marker", this.location.title);
    this.marker.classList.remove("marker_active");
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