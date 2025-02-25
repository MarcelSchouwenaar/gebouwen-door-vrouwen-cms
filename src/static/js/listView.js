import * as settings from "../settings.js";
import * as utils       from "./utils.js";

export class ListView {

    gallery;
    stateMachine;
    imgx;
    imgy;

    constructor(gallery, stateMachine) {
        //inject itself in the dom
        this.gallery = document.getElementById(gallery);
        this.stateMachine = stateMachine;
        this.addListViewButton();
    }
    addListViewButton() {
        const self = this;
        const listViewButton = document.createElement("div");
        listViewButton.id = "listViewButton";
        listViewButton.innerHTML = `<div class="listViewButton">Projectlijst</div>`;
        listViewButton.addEventListener("click", async () => {
           await self.addListView();
        });
        this.gallery.prepend(listViewButton);
    }
    async addListView() {
        const listView = document.createElement("div");
        listView.id = "listView";
        const list = await this.fetchList();
        listView.innerHTML = this._template(list);
        
        listView.querySelectorAll("p").forEach((p) => { if (p.innerHTML === "") p.remove(); });
        
        let body = document.getElementsByTagName("body")[0];
        body.prepend(listView);

        this.addEventListeners();

    }
    addEventListeners(){
        let listViewClose = document.getElementById("listViewClose");
        let listViewItems = document.querySelectorAll(".listViewItem");
        let self = this;

        document.onmousemove = (e) => {
           self.imgx = e.clientX;
           self.imgy = e.clientY;
           listViewBody.style.backgroundPosition = `${self.imgx}px ${self.imgy}px`;
        }

        listViewClose.addEventListener("click", (e) => {
            listView.remove();
        });
        listViewItems.forEach((listItem) => {
            listItem.addEventListener("mouseenter", (e) => {
                let listViewBody = document.getElementById("listViewBody");
                let image = e.target.closest("tr").dataset.image;
                listViewBody.style.backgroundImage = `url(${image})`;
            });
            listItem.addEventListener("mouseleave", (e) => {
                let listViewBody = document.getElementById("listViewBody");
                listViewBody.style.backgroundImage = `url()`;
            });
            listItem.addEventListener("click", (e) => {
                let title = e.target.closest("tr").dataset.title;
                let id = utils.getID(title);
                self.stateMachine.navigateTo(settings.get("STATES").INFO, id);
                listView.remove();
            });
        });

    }
    async fetchList() {
        const response = await fetch("/locations");
        const content = await response.text();
        const parser = new DOMParser();
        const html = parser.parseFromString(content, "text/html");
        const table = html.querySelector("body").innerHTML;

        return table;
    }
    _template(content){
        return `
            <div id="listViewClose">
                <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="" stroke="#ffffff" style="stroke: var(--bg-color);" stroke-width="2">
                        <line x1="0.5" y1="0.5" x2="23.5" y2="23.5" id="Line"></line>
                        <line x1="23.5" y1="0.5" x2="0.5" y2="23.5" id="Line-2"></line>
                    </g>
                </svg>
            </div>
            <div id="listViewBody">
                ${content}
            </div>
        `;
    }


}