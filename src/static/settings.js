import * as utils from "./js/utils.js";

//META
let settings = {};
settings.TITLE = "Site title";
settings.DESCRIPTION = `Site description`;
settings.ABOUT = settings.DESCRIPTION;
settings.DEFAULT_LANG = "nl";
settings.LOGO = "";

settings.MANIFEST_URL = "https://" + location.host + location.pathname;

settings.ENABLE_LOADER = false;

const CDN_PATH =
  "https://cdn.glitch.global/4c0493cc-1166-4590-9984-15c2b192cd62/";
settings.PROXY = "https://follymaps.glitch.me/proxy";

const ICON_PATH = "./static/img/"

settings.MANIFEST_ICONS = {
  icons512: ICON_PATH + "icon-512x512.png",
  icons256: ICON_PATH + "icon-256x256.png",
  icons192: ICON_PATH + "icon-192x192.png",
  icons180: ICON_PATH + "icon-180x180.png",
  icons32: ICON_PATH + "icon-32x32.png",
  icons16: ICON_PATH + "icon-16x16.png",
};

// settings.GMAP_ID = "1iaBUt-YoQnTFQPocSNxlpKPP-9_RSVk"; //BOTANICAL MONUMENTS
// settings.GMAP_URL = "https://www.google.com/maps/d/kml?forcekml=1&mid=" + settings.GMAP_ID;
// settings.GMAP_TITLE = settings.TITLE;
// settings.GMAP_DESCRIPTION = settings.DESCRIPTION;

settings.GSHEET_ID = "1gELkm5Dfh8hrB5bQfnlKYxk5vySNh7AJGrSaUbnM_KM";

//MAPBOX
settings.MAPBOX_STYLE  = "mapbox://styles/toonkoehorst/clw4ziad902mg01qz24uk8dgu";
settings.MAPBOX_API_KEY = "pk.eyJ1IjoidG9vbmtvZWhvcnN0IiwiYSI6ImNqb2ZyYjhiZDAweWIzcXM2aWlhMmJxcGYifQ.OGRL7kejFrWD-MEazU8lTg";

settings.MAPBOX_CENTER = [4.472671, 51.91934];
settings.MAPBOX_DEFAULT_ZOOM = 12;
settings.MAPBOX_DETAIL_ZOOM = 16;

//DEFAULT SETTINGS

settings.COLOR_BG = "#B496FF"; //#C85243
settings.COLOR_FRONT = "#000000";
settings.COLOR_HIGHLIGHT = "#ffff66"; //#0000ff

settings.FONT_FAMILY =
  "arial, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif";

settings.FONT_WEBFONT = false;

// STYLE
settings.MAP_AREA_FILL = "#00ff00";
settings.MAP_AREA_OPACITY = 0.25;
// 00CC11
settings.MAP_AREA_OUTLINE = settings.COLOR_HIGHLIGHT;
settings.MAP_AREA_HOVER_OPACITY = 0.5;
settings.MAP_AREA_HOVER_OUTLINE = settings.COLOR_HIGHLIGHT;

settings.PLACEHOLDER_IMAGE = "./static/images/default.jpg";
settings.OG_IMAGE = "./static/images/default.jpg";

settings.DEFAULT_AUTHOR = "";
settings.AUTHORS = [];

// PATTERNS

let p0 = CDN_PATH + "p0.png?v=1718888319569";
let p1 = CDN_PATH + "p0.png?v=1718888319569";
let p2 = CDN_PATH + "p0.png?v=1718888319569";
let p3 = CDN_PATH + "p0.png?v=1718888319569";
let p4 = CDN_PATH + "p0.png?v=1718888319569";
let p5 = CDN_PATH + "p0.png?v=1718888319569";
let p6 = CDN_PATH + "p0.png?v=1718888319569";
let p7 = CDN_PATH + "p0.png?v=1718888319569";
let p8 = CDN_PATH + "p0.png?v=1718888319569";
let p9 = CDN_PATH + "p0.png?v=1718888319569";


settings.PATTERN_WIDTH = 80;
settings.PATTERN_HEIGHT = 80;

//TAGS & ICONS

settings.HIDE_DEFAULT_TAG = false;

settings.TAG_SYSTEM = [
  {
    title: "botanicalmonuments", //titles cannot contain spaces!
    parent: null, //parent null means it becomes a root category
    icon: "🌲",
    pattern: p0,
    locales: {
      en: "botanical monuments", //but locales can!
      nl: "botanical monuments",
    },
  },
  //soil
  {
    title: "soil",
    parent: null,
    icon: "🪱",
    pattern: p1,
    locales: {
      en: "soil",
      nl: "bodem",
    },
  },
  {
    title: "water",
    parent: null,
    icon: "💧",
    pattern: p2,
    locales: {
      en: "water",
      nl: "water",
    },
  },
  //water
  {
    title: "plants",
    parent: null,
    icon: "☘️",
    pattern: p3,
    locales: {
      en: "plants",
      nl: "planten",
    },
  },

  {
    title: "animals",
    parent: null,
    icon: "🦉",
    pattern: p4,
    locales: {
      en: "animals",
      nl: "dieren",
    },
  },

  {
    title: "night",
    parent: null,
    icon: "🌌",
    pattern: p5,
    locales: {
      en: "night",
      nl: "nacht",
    },
  },
  {
    title: "seasons",
    parent: null,
    icon: "🍁",
    pattern: p6,
    locales: {
      en: "seasons",
      nl: "seizoenen",
    },
  },
  {
    title: "food",
    parent: null,
    icon: "🍅",
    pattern: p7,
    locales: {
      en: "food",
      nl: "voedsel",
    },
  },
  //Stewards
  {
    title: "stewards",
    parent: null,
    icon: "🧑‍🌾",
    pattern: p2,
    locales: {
      en: "stewards",
      nl: "stewards",
    },
  },

  {
    title: "community",
    parent: null,
    icon: "🤝",
    pattern: p9,
    locales: {
      en: "community",
      nl: "community",
    },
  },
  {
    title: "event",
    parent: null,
    icon: "📅",
    pattern: p6,
    locales: {
      en: "event",
      nl: "evenement",
    },
  }
];

//UI

settings.STATES = {
  LIST: 0,
  INFO: 1,
  MENU: 2,
};

export const getAllSettings = () => {
  return Object.keys(settings);
};

export const get = (key) => {
  // let val = localStorage.getItem(key) || settings[key];
  let val = settings[key];
  // if(!val){
  //   console.log("no local value for", key, "so", settings[key]);
  //   val = settings[key];
  //   set(key,val);
  // } 
  return val
};

export const set = (key, value) => {
  settings[key] = value;
  // localStorage.setItem(key, value);
};


export const reset = (key) => {
  if (key && settings[key]) return localStorage.removeItem(key);
  if (confirm("Are you sure you want to revert local changes?"))
    localStorage.clear();
};

export const setAll = (obj) => {
  console.log("setting all", obj);
  Object.keys(obj).forEach((key) => set(key, obj[key]));
}
export const getObj = (key) => {
  // const obj = localStorage.getItem(key);
  // return obj ? JSON.parse(obj) : settings[key];
  return settings[key];
};

export const setObj = (key, value) => {
  const obj = JSON.stringify(value);
  return set(key, obj);
};