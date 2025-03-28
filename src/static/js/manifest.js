import * as settings from "../settings.js";

export function initializeManifest() {
  let manifest = {
    name: settings.get("TITLE"),
    short_name: settings.get("TITLE"),
    description: settings.get("DESCRIPTION"),
    start_url: window.location.origin,
    display: "standalone",
    background_color: settings.get("COLOR_BG"),
    theme_color: settings.get("COLOR_BG"),
    icons: [
      {
        src: "https://" + location.hostname + "/" + settings.get("MANIFEST_ICONS").icons512.replace("./",""),
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "https://" + location.hostname + "/" + settings.get("MANIFEST_ICONS").icons192.replace("./",""),
        sizes: "192x192",
        type: "image/png",
      }
    ]
  };

  const stringManifest = JSON.stringify(manifest);
  const blob = new Blob([stringManifest], { type: "application/json" });
  const manifestURL = URL.createObjectURL(blob);
  
  console.log("MANIFEST",manifest);
  
  document.querySelector("#manifest-placeholder").setAttribute("href", manifestURL);
  document.querySelector("#favicon-placeholder").setAttribute("href",settings.get("MANIFEST_ICONS").icons32);
  document.querySelector("#apple-touch-icon-180").setAttribute("href",settings.get("MANIFEST_ICONS").icons180);
  document.querySelector("#apple-touch-icon-32").setAttribute("href",settings.get("MANIFEST_ICONS").icons32);
  document.querySelector("#apple-touch-icon-16").setAttribute("href",settings.get("MANIFEST_ICONS").icons16);
  document.querySelector("#tile-color-placeholder").setAttribute("content",settings.get("COLOR_BG"));
  document.querySelector("#theme-color-placeholder").setAttribute("content",settings.get("COLOR_BG"));
}
