import * as settings from "../settings.js";
import {TagSystem} from "./tagsystem.js";

const tagSystem = new TagSystem();

const loadImage = path => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous' // to avoid CORS if used with Canvas
    img.src = path
    img.onload = () => {
      resolve(img)
    }
    img.onerror = e => {
      reject(e)
    }
  })
}

export const PatternMaker = async function(tags){
    
  let images = tags.map(tag => tag.pattern);
  if(images.length == 0) images = [tagSystem.defaultTag.pattern];
  
  const canvas = document.createElement("canvas");
  const cw = canvas.width = settings.get("PATTERN_WIDTH");
  const ch = canvas.height = settings.get("PATTERN_HEIGHT");
  
  const ctx = canvas.getContext('2d');
  
  let height, width;

  for (let i = 0; i < images.length; i++) { 
    let img = await loadImage(images[i]);
    ctx.drawImage(img,0,0, cw, ch)
  }

  return canvas.toDataURL();
  
}

