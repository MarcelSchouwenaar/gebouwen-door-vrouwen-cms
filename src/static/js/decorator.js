import * as settings     from "../settings.js";
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
  navigation;

  constructor(stateMachine, navigation){
    
    this.stateMachine = stateMachine;
    
    this.toggle           = document.getElementById("toggle");
    this.close            = document.getElementById("close");
    this.menuToggle       = document.getElementById("menu-toggle");
    this.aboutPage        = document.getElementById("about");
    
    this.title            = settings.get("TITLE");
    this.description      = settings.get("DESCRIPTION");
    this.about            = settings.get("ABOUT");

    this.navigation       = navigation;
    
    this.setColors();
    this.setThemeColors();

    this.setFonts();
    this.setTitleAndDescription();


    this.setSiteLogo();
    
    this.addEventListeners();

  }
  async init(){
    await this.addPages();
  }
  async setManifest(){
    await initializeManifest();
    return true;
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
    console.log("setting font-family", settings.get("FONT_FAMILY"));
    document.documentElement.style.setProperty("--default-font-family",settings.get("FONT_FAMILY"));
  }
  setSiteLogo(){
    document.getElementById("logo-img").src = settings.get("LOGO");
  }
  setTitleAndDescription(){
    
    document.getElementById("title").innerHTML = settings.get("TITLE");
    document.title = settings.get("TITLE");
    document.description = settings.get("DESCRIPTION");
  }
  setLanguage(){
    document.documentElement.setAttribute('lang', settings.get("DEFAULT_LANG"));
  }

  async addPages(){
  
    let menu = document.getElementById("menu");
    let list = document.createElement("ul");
    let i = 0;

    for await (let navItem of this.navigation){
      i++;
      
      let item = document.createElement("li");
      item.classList.add("menu-item");

      let item_label = document.createElement("label");
      item_label.setAttribute("for", `menu-item-${i}`);

      let item_h = document.createElement("h2");
      item_h.innerHTML = navItem.text;

      
      let item_checkbox = document.createElement("input");
      item_checkbox.type = "checkbox";
      item_checkbox.id = `menu-item-${i}`;
      if(i == 1) item_checkbox.checked = true;
      item.appendChild(item_checkbox);

      let item_div = document.createElement("div");
      let content = await this.fetchPage("pages/"+navItem.link);
      item_div.innerHTML = `${content}`;

      item_label.appendChild(item_h);
      
      item.appendChild(item_label);
      item.appendChild(item_checkbox);
      item.appendChild(item_div);
    
      list.appendChild(item);
    };

    menu.appendChild(list);
  }
  async fetchPage(link) {

    const response = await fetch(link);
    const content = await response.text();
    const parser = new DOMParser();
    const html = parser.parseFromString(content, "text/html");
    const body = html.querySelector("body").innerHTML;

    return body;
  }

}
