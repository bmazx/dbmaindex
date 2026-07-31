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

    const settingCheckboxSelWin = document.getElementById("setting-checkbox-sel-win");
    settingCheckboxSelWin.addEventListener("input", e => {
        if (settingCheckboxSelWin.checked) {
            document.documentElement.style.setProperty("--win-idle", "var(--hi-color)");
        }
        else {
            document.documentElement.style.setProperty("--win-idle", "var(--bg-color2)");
        }
    });

    const settingCheckboxWinShake = document.getElementById("setting-checkbox-win-shake");
    settingCheckboxWinShake.addEventListener("input", e => {
        document.body.classList.toggle("animations-off", !settingCheckboxWinShake.checked);
    });

    const settingCheckboxEnableShadows = document.getElementById("setting-checkbox-shadows");
    settingCheckboxEnableShadows.addEventListener("input", e => {
        document.body.classList.toggle("shadow-off", !settingCheckboxEnableShadows.checked);
    });


    const settingOuterGap = document.getElementById("setting-outer-gap");
    settingOuterGap.addEventListener("input", e => {
        document.documentElement.style.setProperty("--outer-gap", `${e.target.value}px`);
    });

    const settingInnerGap = document.getElementById("setting-inner-gap");
    settingInnerGap.addEventListener("input", e => {
        document.documentElement.style.setProperty("--inner-gap", `${e.target.value}px`);
    });

    const settingBorderWidth = document.getElementById("setting-border-width");
    settingBorderWidth.addEventListener("input", e => {
        document.documentElement.style.setProperty("--border-width", `${e.target.value}px`);
    });

    const settingShadowBlur = document.getElementById("setting-shadow-blur");
    settingShadowBlur.addEventListener("input", e => {
        document.documentElement.style.setProperty("--shadow-blur", `${e.target.value}px`);
    });

    const settingShadowSpread = document.getElementById("setting-shadow-spread");
    settingShadowSpread.addEventListener("input", e => {
        document.documentElement.style.setProperty("--shadow-spread", `${e.target.value}px`);
    });


    const settingColorBg = document.getElementById("setting-bg-color");
    settingColorBg.addEventListener("input", e => {
        document.documentElement.style.setProperty("--bg-color", e.target.value);
    });

    const settingColorBg2 = document.getElementById("setting-bg2-color");
    settingColorBg2.addEventListener("input", e => {
        document.documentElement.style.setProperty("--bg-color2", e.target.value);
        document.documentElement.style.setProperty("--win-idle", e.target.value);
    });

    const settingColorFg = document.getElementById("setting-fg-color");
    settingColorFg.addEventListener("input", e => {
        document.documentElement.style.setProperty("--fg-color", e.target.value);
    });

    const settingColorFg2 = document.getElementById("setting-fg2-color");
    settingColorFg2.addEventListener("input", e => {
        document.documentElement.style.setProperty("--fg-color2", e.target.value);
    });

    const settingColorMain = document.getElementById("setting-hi-color");
    settingColorMain.addEventListener("input", e => {
        document.documentElement.style.setProperty("--hi-color", e.target.value);
    });

    const settingColorButtonHover = document.getElementById("setting-button-hover-color");
    settingColorButtonHover.addEventListener("input", e => {
        document.documentElement.style.setProperty("--button-hover", e.target.value);
    });

    const settingColorButtonActive = document.getElementById("setting-button-active-color");
    settingColorButtonActive.addEventListener("input", e => {
        document.documentElement.style.setProperty("--button-active", e.target.value);
    });

    const settingColorNotify = document.getElementById("setting-notify-color");
    settingColorNotify.addEventListener("input", e => {
        document.documentElement.style.setProperty("--notify-color", e.target.value);
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
