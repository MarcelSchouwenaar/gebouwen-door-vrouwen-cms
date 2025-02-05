import * as settings from "../settings.js";

class Tag {
  title;
  parent;
  icon;
  pattern;
  locales = {};

  constructor(title, parent, icon, pattern, locales) {
    this.title = title;
    this.parent = parent;
    this.icon = icon;
    this.pattern = pattern;
    this.locales = locales;
  }
  getLocale(lang) {
    return this.locale[lang] || this.title;
  }
  getTagForLocale(tagLocale) {
    let result = undefined;

    for (const [lang, locale] of Object.entries(this.locales)) {
      if (tagLocale == locale) {
        result = this;
      }
    }
    
    return result;
  }
  getTagLocaleHTML() {
    let tagLocaleHTML = "";
    for (const [lang, locale] of Object.entries(this.locales)) {
      tagLocaleHTML += `<span lang="${lang}">${locale}</span>`;
    }
    return tagLocaleHTML;
  }
  getIcon(){
    return this.icon || "🧌";
  }
  isRootTag() {
    return this.parent === null;
  }
}

export class TagSystem {
  tags = {};
  defaultTag;

  constructor() {
    const self = this;

    let allTags = settings.getObj("TAG_SYSTEM");

    allTags.forEach((tag) => {
      let tagObj = new Tag(
        tag.title,
        tag.parent,
        tag.icon,
        tag.pattern,
        tag.locales
      );
      self.tags[tag.title] = tagObj;
    });

    this.defaultTag = Object.values(this.tags)[0];
  }
  getAllTagsAsArray() {
    return Object.values(this.tags);
  }
  getTagByTitle(tagTitle) {
    return this.tags[tagTitle].title;
  }
  getDefaultTagTitle() {
    return this.defaultTag.title;
  }

  getTagTitleByLocale(tagLocale) {
    let result = undefined;
    for (const [tagTitle, tag] of Object.entries(this.tags)) {
      if (tag.getTagForLocale(tagLocale)) result = tagTitle;
    }
    return result;
  }
  getTagLocaleHTML(tagTitle) {
    return this.tags[tagTitle].getTagLocaleHTML();
  }
  isRootTag(tagTitle) {
    return this.tags[tagTitle].isRootTag();
  }

  getRootTags() {
    let rootTags = [];
    for (const [tagTitle, tag] of Object.entries(this.tags)){
      if(tag.parent === null) rootTags.push(tag);
    }
    return rootTags;
  }
  
  completeTagList(locationTags) {
    
    const self = this;
    
    let rootTags = [];
    let childTags = [];
    

    locationTags.forEach(tagTitle => {
      let tag = self.tags[tagTitle] || undefined;
      if(!!tag){
        if(tag.parent === null) return rootTags.push(tag);
        if(tag.parent != null){
          let parentTagTitle = tag.parent;
          rootTags.push(self.tags[parentTagTitle]);
          childTags.push(tag);
        }
      }
    })
    let relevantTags = childTags.concat(rootTags);
    if (relevantTags.length <= 0) relevantTags.push(this.defaultTag);
        
    let relevantTagsUnique = [...new Set(relevantTags)];
   
    return relevantTagsUnique;
  }
}
