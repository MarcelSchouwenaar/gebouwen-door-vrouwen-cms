import * as settings     from "../settings.js";
import * as utils        from "./utils.js";

export class MultiLang{
  parent;
  selectEl;
  languages = [];
  styleEl;
  
  constructor(parent){
    this.parent = document.getElementById(parent);
    this.getAllLanguages();
    this.render();
    this.addEventListeners();
    
    const preferedLang = navigator.language;
    const preferedLangShort = (preferedLang.indexOf("-") > 0) ? preferedLang.split("-")[0] : preferedLang;
    const defaultLang = this.languages.includes(preferedLangShort) ? preferedLangShort : settings.get("DEFAULT_LANG");
    this.selectEl.value = defaultLang;

    this.setLanguage(defaultLang);
  }
  getAllLanguages(){
    let foundLanguages = [];
    let languageElements = document.querySelectorAll("[lang]")
      .forEach(el => {foundLanguages.push(el.getAttribute("lang"))});
    this.languages = [...new Set(foundLanguages)];
  }
  addEventListeners(){
    const self = this;
    this.selectEl.addEventListener("change",function(e){ self.setLanguage() }); 
  }
  setLanguage(_lang){
    
    let lang = _lang || this.selectEl.value;
    document.documentElement.setAttribute('lang', lang);
    
    this.styleEl.innerHTML = "";
    
    let css = `
      span[lang]{
        display: none;
      }
      span[lang=${lang}]{
        display: inline-block;
      }
    `;
    this.styleEl.appendChild(document.createTextNode(css));
        
  }
  render(){
       
    let self = this;
    this.parent.innerHTML = "";
    
    this.selectEl = document.createElement("select");
    this.parent.appendChild(this.selectEl);
    
    this.languages.forEach(lang => {
      let option = document.createElement("option");
      option.text = lang;
      option.value = lang;
      if(lang == settings.get("DEFAULT_LANG")) option.selected = true;
      self.selectEl.add(option);
    })
    
    this.styleEl = document.createElement("style");
    this.styleEl.type = 'text/css';
    
    document.head.appendChild(this.styleEl);
    
  }
  
}