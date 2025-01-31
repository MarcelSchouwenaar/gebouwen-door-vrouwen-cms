import * as settings     from "./settings.js";
import * as utils        from "./js/utils.js";

import { Loader }        from "./js/loader.js";
import { Map }           from "./js/map.js";
import { Filter }        from "./js/filter.js";
import { TagSystem }     from "./js/tagsystem.js";
import { StateMachine }  from "./js/stateMachine.js";
import { Place }         from "./js/place.js";
import { UserContent }   from "./js/usercontent.js";
import { Decorator }     from "./js/decorator.js";
import { MultiLang }     from "./js/multilang.js";



/*************************************
Follywood Magic!
**************************************/

const init = async function(){
  try{
    
    const userSettings    = await utils.fetchUserSettings();

    const loader          = new Loader();

    //load map
    const mapObj          = new Map();
    const map             = await mapObj.init();
    
    loader.addStatus("Loaded Base Map");
    
    //setup UI
    let tagSystem         = new TagSystem();
    let stateMachine      = new StateMachine(map);    
    let filter            = new Filter("filter");
    
    loader.addStatus("Added UI elements");

    //load data
    const mapData         = await fetch(settings.get("GMAP_URL"));
    
    loader.addStatus("Loaded Map Data");

    //process data
    const mapDataText     = await mapData.text();
    const geoJSON         = utils.createGeoJSON(mapDataText);
        
    loader.addStatus("Processed location data");

    const locations       = geoJSON.locations; 
    
    settings.set("GMAP_TITLE",geoJSON.title);
    settings.set("GMAP_DESCRIPTION",geoJSON.description);
        
    //add styles and UI elements
    let decorator         = new Decorator(stateMachine);
    
    //add locations to the map
    locations.forEach((location) => {
       new Place(location, map, "list", "info", filter, stateMachine);
    });
    
    loader.addStatus("Created all locations");
    
    //get user generate content
    const userContributedData = await utils.fetchUserContent(settings.get("GSHEET_ID"));
    console.log(userContributedData);
    
    //add user locations to the map
    userContributedData.forEach((userContent) => {
      if(userContent.approved == "yes") new UserContent(userContent,  map, "list", "info", filter, stateMachine);
    });
    
    //add language selector
    const multilang = new MultiLang("language-selector");
    
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
