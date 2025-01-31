import * as settings from "../settings.js";
import * as utils from "./utils.js";
import { Place } from "./place.js";
import { TagSystem } from "./tagsystem.js";

export class UserContent extends Place {
  constructor(
    locationLine,
    map,
    gallery,
    infopanel,
    filter,
    stateMachine
  ) {
    
    let location = {};
    let tagSystem = new TagSystem();

    location.geometry = {};
    location.geometry.coordinates = utils.getCoordinatesFromURL(locationLine.locationURL);
    location.geometry.type = "Point";

    location.properties = {};
    location.properties.name = utils.wrapLanguageTags(`[en]${locationLine.title_en}[/en][nl]${locationLine.title_nl}[/nl]`);
    location.properties.description = `[en]${locationLine.description_en}[/en][nl]${locationLine.description_nl}[/nl]`;

    let tagsArr = locationLine.category.split(",");
    let tags = "";
    tagsArr.forEach(_tag => {
      let tag = `#${tagSystem.getTagTitleByLocale(_tag)} `;
      tags += tag || "";
    })
      
    location.properties.description += tags;
    location.properties.description = utils.wrapLanguageTags(location.properties.description);
    location.properties.gx_media_links = utils.createPublicGoogleImageURLs(locationLine.photos);

    location.type = "Feature";

    super(location, map, gallery, infopanel, filter, stateMachine);
  }
}
