import * as settings from "../settings.js";
import {TagSystem } from "./tagsystem.js"

export class Filter {
  
  parent;
  tagList;
  firstClick;
  currentFilter;
  tagSystem;
  filterEvent = new Event("filterUpdate");

  constructor(parent, tagSystem) {
   
    this.tagSystem = new TagSystem();
    this.parent = document.getElementById(parent);
    this.addFilterTags();
    this.addReset();
    this.setFilter();  
    this.firstClick = true;
    
  }

  getFilterTag(tag, icon) {
    let el = document.createElement("label");
    let localizedTag = this.tagSystem.getTagLocaleHTML(tag);
    let isRoot = this.tagSystem.isRootTag(tag);
    el.className = "tagLbl";
    el.innerHTML = `<input type="checkbox" name="${tag}" value="${tag}" checked><span class="tag noselect ${ (isRoot) ? "tag-mobile" : "tag-desktop"}">${icon}  ${localizedTag}</span>`;
    return el;
  }
  addFilterTags() {
    const self = this;
    
    let allTags = this.tagSystem.getAllTagsAsArray();
    if(settings.get("HIDE_DEFAULT_TAG")) allTags.shift();
    
    allTags.forEach(tag => {
      let el = self.getFilterTag(tag.title, tag.icon);
      el.querySelector("input").addEventListener("change",e => self.changed(e))
      self.parent.appendChild(el);
    })
        
  }
  addReset(){
    const self = this;

    let resetEl = document.createElement("div")
    resetEl.innerHTML = "reset";
    resetEl.classList.add("tag","tagReset");
    resetEl.addEventListener("click",e => self.resetFilter(e));
    this.parent.appendChild(resetEl);
  }
  changed(e){
    
    if(this.firstClick){
      let allTags = this.parent.querySelectorAll("input");
      allTags.forEach(tag => tag.checked = false);
      e.target.checked = true;
      this.firstClick = false;
    }
    
    this.setFilter();
    
    
  }
  setFilter(){
    let selectedTags = this.parent.querySelectorAll("input:checked");
    let _currentFilter = [];
    
    if(settings.get("HIDE_DEFAULT_TAG")) _currentFilter.push(this.tagSystem.defaultTag.title);

    selectedTags.forEach(tagEl => {
      _currentFilter.push(tagEl.value);
    });
    
    this.currentFilter = _currentFilter;
   
    document.body.dispatchEvent(this.filterEvent);
    
  }

  resetFilter(){
    let allTags = this.parent.querySelectorAll("input");
    allTags.forEach(tag => tag.checked = true);
    
    this.setFilter();
  }

}


