class Window {
    constructor(title, id) {
        this.title = title;
        this.id = id;
        this.win = document.createElement("div");

        this.win.id = id;
        this.win.classList.add("window");

        // window title
        this.winTitleElem = document.createElement("div");
        this.winTitleElem.classList.add("window-title");

        this.titleElem = document.createElement("p");
        this.titleElem.textContent = title;

        this.winTitleElem.appendChild(this.titleElem);

        // window client
        this.winClientElem = document.createElement("div");
        this.winClientElem.classList.add("window-client");

        // window buttons
        const windowButtons = document.createElement("div");
        windowButtons.classList.add("window-title-buttons");

        const winButtonClose = document.createElement("button");
        winButtonClose.type = "button";
        winButtonClose.textContent = "X";
        winButtonClose.id = `${this.id}-close`;

        const winButtonDown = document.createElement("button");
        winButtonDown.type = "button";
        winButtonDown.textContent = "V";
        winButtonDown.id = `${this.id}-down`;

        const winButtonUp = document.createElement("button");
        winButtonUp.type = "button";
        winButtonUp.textContent = "^";
        winButtonDown.up = `${this.id}-up`;

        windowButtons.appendChild(winButtonClose);
        windowButtons.appendChild(winButtonDown);
        windowButtons.appendChild(winButtonUp);

        this.winTitleElem.appendChild(windowButtons);

        // set button event listeners
        winButtonClose.addEventListener("click", () => {
            this.win.remove();
        });
        winButtonDown.addEventListener("click", () => {
            const nextWin = this.win.nextElementSibling;

            if (!nextWin) {
                return;
            }

            nextWin.after(this.win);
        });
        winButtonUp.addEventListener("click", () => {
            const prevWin = this.win.previousElementSibling;

            if (!prevWin) {
                return;
            }

            prevWin.before(this.win);
        });

        this.win.appendChild(this.winTitleElem);
        this.win.appendChild(this.winClientElem);
    }

    setTitle(title) {
        this.title = title;
        this.titleElem.textContent = title;
    }

    removeClientContent() {
        while (this.winClientElem.firstChild) {
            this.winClientElem.removeChild(this.winClientElem.lastChild);
        }
    }

    setClientTemplate(templateId) {
        this.removeClientContent();
        const template = document.getElementById(templateId);
        const content = template.content.cloneNode(true);
        this.winClientElem.appendChild(content);
    }

    appendClientContent(elem) {
        this.winClientElem.appendChild(elem);
    }

    notify() {
        this.winTitleElem.classList.add("window-title-anim-notify");

        this.winTitleElem.addEventListener("animationend", () => {
            this.winTitleElem.classList.remove("window-title-anim-notify");
        }, { once: true });
    }
}

const stack = document.getElementById("stack0");

function updateDate() {
    const date = new Date();
    const dateFormat = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const timeFormat = String(date.getHours()).padStart(2, '0') + ":" +
                       String(date.getMinutes()).padStart(2, '0') + ":" +
                       String(date.getSeconds()).padStart(2, '0');

    document.getElementById("date").textContent = dateFormat + " - " + timeFormat;
}

var order = 1;
function pushWindowToStack(winobj) {
    // const angle = order * Math.random() * 1.5;
    // order *= -1;
    // winobj.win.style.transform = `rotate(${angle}deg)`;

    stack.appendChild(winobj.win);
}

function pushWindowToStackFront(winobj) {
    stack.prepend(winobj.win);
}

// slider range

class SliderRange extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.id = this.getAttribute("id");
        this.name = this.getAttribute("name") ?? "";
        this.value = Number(this.getAttribute("value") ?? 0);
        this.min = Number(this.getAttribute("min") ?? 0);
        this.max = Number(this.getAttribute("max") ?? 100);
        this.step = Number(this.getAttribute("step") ?? 1);

        this.dragging = false;

        this.classList.add("slider-container");

        // slider name
        this.sliderName = document.createElement("div");
        this.sliderName.classList.add("slider-name");
        this.sliderName.textContent = this.name;

        // slider range
        this.sliderRange = document.createElement("div");
        this.sliderRange.classList.add("slider-range");

        if (!this.sliderRange.hasAttribute("tabindex")) {
            this.sliderRange.tabIndex = 0;
        }

        // slider thumb
        this.sliderThumb = document.createElement("div");
        this.sliderThumb.classList.add("slider-thumb");
        this.sliderThumb.style.left = "";

        this.sliderRange.appendChild(this.sliderThumb);

        // slider value
        this.sliderValue = document.createElement("div");
        this.sliderValue.classList.add("slider-val");
        this.sliderValue.textContent = this.value;

        this.appendChild(this.sliderName);
        this.appendChild(this.sliderRange);
        this.appendChild(this.sliderValue);

        // set event listeners
        this.sliderRange.addEventListener("pointerdown", e => {
            this.dragging = true;

            const move = e => this.updateSlider(e.clientX);

            const up = () => {
                this.dragging = false;
                document.removeEventListener("pointermove", move);
                document.removeEventListener("pointerup", up);
            };

            document.addEventListener("pointermove", move);
            document.addEventListener("pointerup", up);

            this.updateSlider(e.clientX);
        });

        this.sliderRange.addEventListener("keydown", e => {
            if (e.key === "ArrowRight") this.value += this.step;
            if (e.key === "ArrowLeft") this.value -= this.step

            this.value = Math.max(this.min, Math.min(this.max, this.value));
            this.sliderValue.textContent = this.value;
            this.updateSliderThumbValue();
        });

        // update slider thumb pos
        requestAnimationFrame(() => {
            this.updateSliderThumbValue();
        });
    }

    updateSlider(clientX) {
        const rect = this.sliderRange.getBoundingClientRect();
        const thumbRect = this.sliderThumb.getBoundingClientRect();

        let leftBound = rect.left + thumbRect.width / 2;
        let rightBound = rect.right - thumbRect.width / 2;
        let percent = (clientX - leftBound) / (rightBound - leftBound);

        percent = Math.max(0, Math.min(1, percent));

        this.value = Math.round(this.min + percent * (this.max - this.min));
        this.value = Math.round(this.value / this.step) * this.step;
        this.value = Math.max(this.min, Math.min(this.max, this.value));

        if (clientX >= rightBound) {
            this.sliderThumb.style.left = `${rect.width - thumbRect.width}px`;
        } else if (clientX <= leftBound) {
            this.sliderThumb.style.left = `0px`;
        } else {
            this.updateSliderThumbValue();
        }

        this.sliderValue.textContent = this.value;
    }

    updateSliderThumbValue() {
        let percent = (this.value - this.min) / (this.max - this.min);
        percent = Math.max(0, Math.min(1, percent));

        const rect = this.sliderRange.getBoundingClientRect();
        const thumbRect = this.sliderThumb.getBoundingClientRect();
        let pos = (rect.width - thumbRect.width) * percent;

        this.sliderThumb.style.left = `calc(${pos}px)`;

        this.dispatchEvent(new Event("input"));
    }

    updateValue(value) {
        this.value = value;
        this.value = Math.max(this.min, Math.min(this.max, this.value));
        this.sliderValue.textContent = this.value;
        this.updateSliderThumbValue();
    }
}

customElements.define("slider-range", SliderRange);

// index ----------------------------------------

var settingsWindow = null;
function openSettings() {
    const settingsElem = document.getElementById("window-settings");

    if (settingsElem) {
        settingsWindow.notify();
        return;
    }

    settingsWindow = new Window("Settings", "window-settings");
    settingsWindow.setClientTemplate("settings");

    pushWindowToStackFront(settingsWindow);

    const settingColorMain = document.getElementById("setting-hi-color");
    settingColorMain.addEventListener("input", e => {
        document.documentElement.style.setProperty("--hi-color", e.target.value);
    });

    const settingColorBg = document.getElementById("setting-bg-color");
    settingColorBg.addEventListener("input", e => {
        document.documentElement.style.setProperty("--bg-color", e.target.value);
    });
}


// project ----------------------------------------

function displayProject(card) {
    const templateElem = card.getElementsByTagName("template")[0];
    const projectInfoWindow = document.getElementById("project-info");
    const windowClientElem = projectInfoWindow.getElementsByClassName("window-client")[0];

    while (windowClientElem.firstChild) {
        windowClientElem.removeChild(windowClientElem.lastChild);
    }

    const content = templateElem.content.cloneNode(true);
    windowClientElem.appendChild(content);

    // set background color for selected card
    const selCard = document.getElementById("sel-card");
    if (selCard) {
        selCard.style.backgroundColor = "";
        selCard.id = "";
    }

    card.style.backgroundColor = "var(--hi-color)";
    card.id = "sel-card";
}


// entry point ----------------------------------------

if (document.body.id === "home") {
    const win1 = new Window("Window 1", "win1");
    win1.winClientElem.innerHTML = "<h1>Header 1</h1><h2>Header 2</h2><h3> Header 3</h3><h4>Header 4</h4><h5>Header 5</h5><h6>Header 6</h6><p>This is in the div</p><p>This is in the <b>div</b></p><p>This is in the <i>div</i></p>";

    const win2 = new Window("Window 2", "win2");
    win2.winClientElem.innerHTML = "<p>This is in the div</p><p>This is in the <b>div</b></p><p>This is in the <i>div</i></p>";

    const win3 = new Window("Window 3", "win3");

    pushWindowToStack(win1);
    pushWindowToStack(win2);
    pushWindowToStack(win3);
}

if (document.body.id === "projects") {

}

updateDate();
setInterval(updateDate, 1000);
