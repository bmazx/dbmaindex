class WindowBox extends HTMLElement {
    constructor() {
        super();

        this.winTitleElem = document.createElement("div");
        this.winTitleElem.classList.add("window-title");

        // title
        this.titleElem = document.createElement("p");
        this.winTitleElem.appendChild(this.titleElem);

        // buttons
        this.winBtn = document.createElement("div");
        this.winBtn.classList.add("window-title-buttons");

        this.closeBtn = document.createElement("button");
        this.closeBtn.textContent = "X";
        this.winBtn.appendChild(this.closeBtn);

        this.downBtn = document.createElement("button");
        this.downBtn.textContent = "V";
        this.winBtn.appendChild(this.downBtn);

        this.upBtn = document.createElement("button");
        this.upBtn.textContent = "^";
        this.winBtn.appendChild(this.upBtn);

        this.winTitleElem.appendChild(this.winBtn);

        // client
        this.clientElem = document.createElement("div");
        this.clientElem.classList.add("window-client");
    }

    connectedCallback() {
        if (this._initialized) return;
            this._initialized = true;

        this.id = this.getAttribute("id");
        this.titleElem.textContent = this.getAttribute("name") ?? "Window";

        const children = [...this.childNodes];

        this.appendChild(this.winTitleElem);
        this.appendChild(this.clientElem);

        this.clientElem.append(...children);

        this.closeBtn.addEventListener("click", () => {
            this.hidden = true;
        });
        this.downBtn.addEventListener("click", () => {
            const nextWin = this.nextElementSibling;

            if (!nextWin) {
                return;
            }

            nextWin.after(this);
        });
        this.upBtn.addEventListener("click", () => {
            const prevWin = this.previousElementSibling;

            if (!prevWin) {
                return;
            }

            prevWin.before(this);
        });
    }

    static get observedAttributes() {
        return ["name", "btn", "overflow", "overflowx", "overflowy"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "name" && this.titleElem) {
            this.titleElem.textContent = newValue;
        }
        else if (name === "btn" && this.winBtn) {
            if (newValue == "true") {
                this.winBtn.hidden = false;
            } else {
                this.winBtn.hidden = true;
            }
        }
        else if (name === "overflow") {
            this.clientElem.style.setProperty("overflow", newValue);
        } else if (name === "overflowx") {
            this.clientElem.style.setProperty("overflow-x", newValue);
        } else if (name === "overflowy") {
            this.clientElem.style.setProperty("overflow-y", newValue);
        }
    }

    notify() {
        this.winTitleElem.classList.add("window-title-anim-notify");

        this.winTitleElem.addEventListener("animationend", () => {
            this.winTitleElem.classList.remove("window-title-anim-notify");
        }, { once: true });
    }

    clearClient() {
        while (this.clientElem.firstChild) {
            this.clientElem.removeChild(this.clientElem.lastChild);
        }
    }

    setClient(elem) {
        this.clearClient();
        this.clientElem.appendChild(elem);
    }

    appendClient(elem) {
        this.clientElem.appendChild(elem);
    }
}
customElements.define("window-box", WindowBox);


var useSystem = false;
function toggleFont() {
    useSystem = !useSystem;
    if (useSystem) {
        document.documentElement.style.setProperty("--font-family", "Arial, Helvetica, sans-serif");
        sessionStorage.setItem("fonts", "Arial, Helvetica, sans-serif");
    } else {
        document.documentElement.style.setProperty("--font-family", "proggyClean, Arial, Helvetica, sans-serif");
        sessionStorage.setItem("fonts", "proggyClean, Arial, Helvetica, sans-serif");
    }
}


// index ----------------------------------------

const stack = document.getElementById("stack0");

function updateDate() {
    const date = new Date();
    const dateFormat = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const timeFormat = String(date.getHours()).padStart(2, '0') + ":" +
                       String(date.getMinutes()).padStart(2, '0') + ":" +
                       String(date.getSeconds()).padStart(2, '0');

    document.getElementById("date").textContent = dateFormat + " - " + timeFormat;
}

function openSettings() {
    const settingsElem = document.getElementById("window-settings");

    if (!settingsElem.hidden) {
        settingsElem.notify();
        return;
    }

    settingsElem.hidden = false;
}

function setTheme(theme) {
    const root = document.documentElement;

    root.classList.remove("smileos");
    root.classList.remove("catppuccin");

    if (theme !== "default") {
        root.classList.add(theme);
    }

    sessionStorage.setItem("theme", theme);
}


// project ----------------------------------------

function displayProject(card) {
    const templateElem = card.getElementsByTagName("template")[0];
    const projectInfoWindowElem = document.getElementById("project-info");

    const content = templateElem.content.cloneNode(true);
    projectInfoWindowElem.setClient(content);

    // set background color for selected card
    const selCard = document.getElementById("sel-card");
    if (selCard) {
        selCard.style.backgroundColor = "";
        selCard.id = "";
    }

    card.style.backgroundColor = "var(--hi-color)";
    card.id = "sel-card";
}

// blog ----------------------------------------

function displayBlog(card) {
    const templateElem = card.getElementsByTagName("template")[0];
    const blogWindowElem = document.getElementById("blog-content");

    const content = templateElem.content.cloneNode(true);
    blogWindowElem.setClient(content);

    // set background color for selected card
    const selCard = document.getElementById("sel-blog");
    if (selCard) {
        selCard.style.backgroundColor = "";
        selCard.id = "";
    }

    card.style.backgroundColor = "var(--hi-color)";
    card.id = "sel-blog";
}

// entry point ----------------------------------------

if (document.body.id === "home") {
    const settingCheckboxSelWin = document.getElementById("setting-checkbox-sel-win");
    if (settingCheckboxSelWin.checked) {
        document.documentElement.style.setProperty("--win-idle", "var(--bg-color2)");
    }
    else {
        document.documentElement.style.setProperty("--win-idle", "var(--hi-color)");
    }
    settingCheckboxSelWin.addEventListener("input", e => {
        if (settingCheckboxSelWin.checked) {
            document.documentElement.style.setProperty("--win-idle", "var(--bg-color2)");
        }
        else {
            document.documentElement.style.setProperty("--win-idle", "var(--hi-color)");
        }
    });

    const settingCheckboxWinShake = document.getElementById("setting-checkbox-win-shake");
    document.body.classList.toggle("animations-off", !settingCheckboxWinShake.checked);
    settingCheckboxWinShake.addEventListener("input", e => {
        document.body.classList.toggle("animations-off", !settingCheckboxWinShake.checked);
    });

    const settingCheckboxEnableShadows = document.getElementById("setting-checkbox-shadows");
    document.body.classList.toggle("shadow-off", !settingCheckboxEnableShadows.checked);
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

if (document.body.id === "projects") {

}

const sideMenu = document.getElementById("side-menu");
if (sideMenu) {
    sideMenu.clientElem.style.setProperty("padding", "0");
}

// local storage
const savedTheme = sessionStorage.getItem("theme");
if (savedTheme) {
    setTheme(savedTheme);
}

const savedFont = sessionStorage.getItem("fonts");
if (savedFont) {
    document.documentElement.style.setProperty("--font-family", savedFont);
}

updateDate();
setInterval(updateDate, 1000);
