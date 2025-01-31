import * as settings from "../settings.js";

export class Loader {
  status = `${settings.get("TITLE")} <br><br>`;
  el;
  enabled;

  constructor() {

    this.enabled = settings.get("ENABLE_LOADER");
    console.log(">> Loader enabled?", this.enabled);

    if(this.enabled != true) return;
  
    const body = document.body;

    this.el = document.createElement("div");
    this.el.classList.add("loader", "active");
    this.el.innerHTML = this.status;
    body.appendChild(this.el);
  }
  addStatus(newStatus) {
    if(this.enabled != true ) return console.log("loader",newStatus);
    this.el.innerHTML += "<br>" + newStatus + " ✅";
  }
  dismiss() {
    if(this.enabled != true) return;
    this.el.innerHTML += "<br><br> All done 🚀";

    let self = this;
    this.el.classList.add("loaderFadeOut");
    this.el.addEventListener("transitionend", (e) => self.removeEl(self.el));
  }
  removeEl(_el) {
    _el.remove();
  }
}
