import * as settings     from "../settings.js";
import * as utils        from "./utils.js";
import { initializeManifest } from "./manifest.js";

export class Decorator{
  stateMachine;
  toggle;     
  close;    
  menuToggle;
  aboutPage;
  title;
  description;
  about;

  constructor(stateMachine){
    
    this.stateMachine = stateMachine;
    
    this.toggle           = document.getElementById("toggle");
    this.close            = document.getElementById("close");
    this.menuToggle       = document.getElementById("menu-toggle");
    this.aboutPage        = document.getElementById("about");
    
    this.title            = settings.get("TITLE");
    this.description      = settings.get("DESCRIPTION");
    this.about            = settings.get("ABOUT");
    
    this.setColors();
    this.setThemeColors();
    this.setFonts();
    this.setTitleAndDescription();
    this.setManifest();
    this.setAboutPage();
    
    this.addEventListeners();

  }
  setManifest(){
    initializeManifest();
  }

  addEventListeners(){
    this.toggle.addEventListener("click", (e) => {this.stateMachine.togglePanel()});
    this.close.addEventListener("click", (e) => { this.stateMachine.navigateTo(settings.get("STATES").LIST) });
    this.menuToggle.addEventListener("click", (e) => { 
      this.stateMachine.navigateTo(settings.get("STATES").MENU);
      this.stateMachine.togglePanel("up");
     });
  }
  setColors(){
    document.documentElement.style.setProperty("--color", settings.get("COLOR_FRONT"));
    document.documentElement.style.setProperty("--bg-color", settings.get("COLOR_BG"));
    document.documentElement.style.setProperty("--highlight-color", settings.get("COLOR_HIGHLIGHT"));
    document.querySelectorAll("path").forEach((el) => { el.setAttribute("style", "fill:" + settings.get("COLOR_FRONT")) });
  }
  setThemeColors(){
    document.querySelector('meta[name="msapplication-TileColor"]').setAttribute("content", settings.get("COLOR_BG"));
    document.querySelector('meta[name="theme-color"]').setAttribute("content", settings.get("COLOR_BG"));
  }
  setFonts(){
    document.documentElement.style.setProperty("--default-font-family",settings.get("FONT_FAMILY"));
    if(settings.get("FONT_WEBFONT")){
      let styleEl = document.createElement("style");
      styleEl.type = "text/css";
      styleEl.appendChild(document.createTextNode(settings.get("FONT_WEBFONT")));
      let head = document.head;
      head.appendChild(styleEl)
    }
  }
  setTitleAndDescription(){
    
    document.getElementById("title").innerHTML = settings.get("TITLE");
    document.title = settings.get("TITLE");
    document.description = settings.get("GMAP_DESCRIPTION") || settings.get("DESCRIPTION");
  }
  setLanguage(){
    document.documentElement.setAttribute('lang', settings.get("DEFAULT_LANG"));
  }

  setAboutPage(){
    
    this.aboutPage.innerHTML = "";
    
    let titleEl = document.createElement("h1");
    titleEl.innerHTML = settings.get("TITLE");
    
    let aboutEl = document.createElement("div");
    let aboutTxt = settings.get("GMAP_DESCRIPTION") || settings.get("ABOUT");
    aboutEl.innerHTML = utils.wrapLanguageTags(aboutTxt);
    
    this.aboutPage.appendChild(titleEl);
    this.aboutPage.appendChild(aboutEl);
        
  }

}
