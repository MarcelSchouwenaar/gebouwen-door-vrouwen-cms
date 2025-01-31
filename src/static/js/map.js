import * as settings from "../settings.js";


export class Map {
  map;

  constructor() {
    mapboxgl.accessToken = settings.get("MAPBOX_API_KEY");
    
    let _style = settings.get("MAPBOX_STYLE");

    this.map = new mapboxgl.Map({
      container: "map",
      style: _style,
      center: settings.get("MAPBOX_CENTER"),
      zoom: settings.get("MAPBOX_DEFAULT_ZOOM"),
    });

  
    

  }

  async init() {
    
    console.log("initing map");

    const loadPromise = new Promise((resolve, reject) => {
      this.map.on("load", () => resolve("map loaded"));
    });
    
    const stylePromise = new Promise((resolve, reject) => {
      this.map.on("styledata", () => resolve("mapStyle loaded"));
    });
    
    console.log("Awaiting map and mapStyle to finish loading...");
    
    const [mapLoaded, styleLoaded] = await Promise.all([ loadPromise, stylePromise]);
    // const mapLoaded = await loadPromise;
    
    console.log("Completed loading: ",mapLoaded)
    
    this.map.setMaxPitch(0);
    this.map.setMinPitch(0);

    return this.map;
  }

  setAccessToken() {
    mapboxgl.accessToken = settings.get("MAPBOX_API_KEY");
  }
  setStyle() {
    this.map.setStyle(settings.get("MAPBOX_STYLE"));
  }
}
