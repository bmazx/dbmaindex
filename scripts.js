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
    }

    static get observedAttributes() {
        return [
            "name", "btn", "overflow", "overflowx", "overflowy", "client-class",
            "width", "height", "w", "h", "maxw", "maxh", "minw", "minh",
        ];
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
        }
        else if (name === "overflowx") {
            this.clientElem.style.setProperty("overflow-x", newValue);
        }
        else if (name === "overflowy") {
            this.clientElem.style.setProperty("overflow-y", newValue);
        }
        else if (name === "client-class") {
            this.clientElem.classList.add(newValue);
        }
        else if (name === "width" || name === "w") {
            this.clientElem.style.setProperty("width", newValue);
        }
        else if (name === "height" || name === "h") {
            this.clientElem.style.setProperty("height", newValue);
        }
        else if (name === "maxw") {
            this.clientElem.style.setProperty("max-width", newValue);
        }
        else if (name === "maxh") {
            this.clientElem.style.setProperty("max-height", newValue);
        }
        else if (name === "minw") {
            this.clientElem.style.setProperty("min-width", newValue);
        }
        else if (name === "minh") {
            this.clientElem.style.setProperty("min-height", newValue);
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
    const ssCheckboxSelWin = sessionStorage.getItem("setting-checkbox-sel-win");
    if (ssCheckboxSelWin !== null) {
        settingCheckboxSelWin.checked = ssCheckboxSelWin === "true";
    }
    settingCheckboxSelWin.addEventListener("input", e => {
        if (settingCheckboxSelWin.checked) {
            document.documentElement.style.setProperty("--win-idle", "var(--bg-color2)");
        }
        else {
            document.documentElement.style.setProperty("--win-idle", "var(--hi-color)");
        }
        sessionStorage.setItem("setting-checkbox-sel-win", settingCheckboxSelWin.checked);
    });

    const settingCheckboxWinShake = document.getElementById("setting-checkbox-win-shake");
    const ssCheckboxWinShake = sessionStorage.getItem("setting-checkbox-win-shake");
    if (ssCheckboxWinShake !== null) {
        settingCheckboxWinShake.checked = ssCheckboxWinShake === "true";
    }
    settingCheckboxWinShake.addEventListener("input", e => {
        document.body.classList.toggle("animations-off", !settingCheckboxWinShake.checked);
        sessionStorage.setItem("setting-checkbox-win-shake", settingCheckboxWinShake.checked);
    });

    const settingCheckboxEnableShadows = document.getElementById("setting-checkbox-shadows");
    const ssCheckboxEnableShadow = sessionStorage.getItem("setting-checkbox-shadows");
    if (ssCheckboxEnableShadow !== null) {
        settingCheckboxEnableShadows.checked = ssCheckboxEnableShadow === "true";
    }
    settingCheckboxEnableShadows.addEventListener("input", e => {
        document.body.classList.toggle("shadow-off", !settingCheckboxEnableShadows.checked);
        sessionStorage.setItem("setting-checkbox-shadows", settingCheckboxEnableShadows.checked);
    });
}

if (document.body.id === "projects") {

}

// status

// toggle font
const statusFontBtn = document.getElementById("status-toggle-font");
let useSystem = sessionStorage.getItem("useSystemFont") === "true";

function toggleFont() {
    const font = useSystem
        ? "Arial, Helvetica, sans-serif"
        : "pixelCode, Arial, Helvetica, sans-serif";

    document.documentElement.style.setProperty("--font-family", font);
}

statusFontBtn.addEventListener("click", () => {
    useSystem = !useSystem;
    sessionStorage.setItem("useSystemFont", useSystem);
    toggleFont();
});

// apply saved preference when the page loads
toggleFont();

// toggle audio
const statusAudioBtn = document.getElementById("status-toggle-audio");
const enableAudioStorage = sessionStorage.getItem("enableAudio");
let enableAudio = enableAudioStorage ? enableAudioStorage === "true" : true;
enableAudio ? statusAudioBtn.style.setProperty("background-image", "")
            : statusAudioBtn.style.setProperty("background-image", "url('/images/audio-mute.png')");

statusAudioBtn.addEventListener("click", () => {
    enableAudio = !enableAudio;
    sessionStorage.setItem("enableAudio", enableAudio);

    if (enableAudio) {
        statusAudioBtn.style.setProperty("background-image", "");
    } else {
        statusAudioBtn.style.setProperty("background-image", "url('/images/audio-mute.png')");
    }
});


// local storage
const savedTheme = sessionStorage.getItem("theme");
if (savedTheme) {
    setTheme(savedTheme);
}

const settingCheckboxSelWin = sessionStorage.getItem("setting-checkbox-sel-win") === "true";
if (settingCheckboxSelWin) {
    document.documentElement.style.setProperty("--win-idle", "var(--bg-color2)");
}
else {
    document.documentElement.style.setProperty("--win-idle", "var(--hi-color)");
}

const ssCheckboxWinShake = sessionStorage.getItem("setting-checkbox-win-shake");
const settingCheckboxWinShake = ssCheckboxWinShake !== null ? ssCheckboxWinShake === "true" : true;
document.body.classList.toggle("animations-off", !settingCheckboxWinShake);

const ssCheckboxEnableShadow = sessionStorage.getItem("setting-checkbox-shadows");
const settingCheckboxEnableShadows = ssCheckboxEnableShadow !== null ? ssCheckboxEnableShadow === "true" : true;
document.body.classList.toggle("shadow-off", !settingCheckboxEnableShadows);


updateDate();
setInterval(updateDate, 1000);

// add sounds
const confirm = new Audio("/audio/confirm2.wav");
const click = new Audio("/audio/click.wav");
const click2 = new Audio("/audio/click2.wav");
const beep = new Audio("/audio/beep.wav");

document.querySelectorAll(".side-menu a, .side-menu button, .side-menu summary, .status-button, button, .workspaces a").forEach(elem => {
    elem.addEventListener("click", (e) => {
        if (!enableAudio)
            return;
        click2.currentTime = 0;
        click2.play();

        if (elem instanceof HTMLAnchorElement && elem.href) {
            e.preventDefault();

            setTimeout(() => {
                window.location.href = elem.href;
            }, 100);
        }
    });
});

document.querySelectorAll(".project-card, .blog-card").forEach(elem => {
    elem.addEventListener("click", () => {
        if (!enableAudio)
            return;
        confirm.currentTime = 0;
        confirm.play();
    });
});

document.addEventListener("click", () => {
    click.play().then(() => {
        click.pause();
        click.currentTime = 0;
    });
}, { once: true });

document.querySelectorAll(".side-menu a, .side-menu button").forEach(elem => {
    elem.addEventListener("mouseenter", () => {
        if (!enableAudio)
            return;
        click.currentTime = 0;
        click.play().catch(() => {});
    });
});

// cursor follower
/*
const follower = document.createElement("div");
follower.id = "cursor-follow";
document.addEventListener("mousemove", (event) => {
    follower.style.display = "inline";
    const offset = 8;
    follower.style.left = `${event.clientX + offset}px`;
    follower.style.top = `${event.clientY + offset}px`;
});
document.body.appendChild(follower);
*/
