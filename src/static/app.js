import * as settings     from "./settings.js";
import * as utils        from "./js/utils.js";

import { Loader }        from "./js/loader.js";
import { Map }           from "./js/map.js";
import { Filter }        from "./js/filter.js";
import { StateMachine }  from "./js/stateMachine.js";
import { Place }         from "./js/place.js";

import { Decorator }     from "./js/decorator.js";
import { MultiLang }     from "./js/multilang.js";
import { ListView }     from "./js/listView.js";

import { initializeManifest }   from "./js/manifest.js";



/*************************************
Follywood Magic!
**************************************/

const init = async function(){
  try{
    
    const loader          = new Loader();

    const userSettings    = await utils.fetchUserSettings();
    settings.setAll(userSettings);

    const tagData     = await utils.fetchTagData();
    settings.set("TAG_SYSTEM", tagData);
    

    //load map
    const mapObj          = new Map();
    const map             = await mapObj.init();
    
    loader.addStatus("Loaded Base Map");
    
    //setup UI
    // let tagSystem         = new TagSystem();
    let stateMachine      = new StateMachine(map);    
    let filter            = new Filter("filter");
    
    loader.addStatus("Added UI elements");

    //load data
    const locationData        = await utils.fetchLocationData();
    
    loader.addStatus("Loaded Map Data");

    //process data
    // const mapDataText     = await mapData.text();
    // const geoJSON         = utils.createGeoJSON(mapDataText);
        
    loader.addStatus("Processed location data");

    const locations       = locationData.locations; 
        
    //add styles and UI elements
    const navigationSettings    = await utils.fetchNavigationSettings();
    
    let decorator               = new Decorator(stateMachine, navigationSettings);
    await decorator.init();
    loader.addStatus("Added UI elements");

    initializeManifest();
    loader.addStatus("Added Manifest");
  
    //add locations to the map
    locations.forEach((location) => {
       new Place(location, map, "list", "info", filter, stateMachine);
    });
    
    loader.addStatus("Created all locations");
    
    //add language selector
    const multilang = new MultiLang("language-selector");

    const listView = new ListView("list", stateMachine);
    
    //load images
    utils.BackgroundLazyLoader();
    
    //initiate state machine
    stateMachine.init();
    
    //exposing some features for the editor
    window.settings = settings;
    window.decorator = decorator;
    window.map = mapObj;
    
    loader.dismiss();

  } catch (err) {
    console.error(err);
  }

}();

/*************************************
End Follywood Magic
**************************************/
