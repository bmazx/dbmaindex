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

    setClientTemplate(templateId) {
        const template = document.getElementById(templateId);
        const content = template.content.cloneNode(true);
        this.winClientElem.appendChild(content);
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
    const angle = order * Math.random() * 1.5;
    order *= -1;
    winobj.win.style.transform = `rotate(${angle}deg)`;

    stack.appendChild(winobj.win);
}

var settingsWindow = null;
function openSettings() {
    const settingsElem = document.getElementById("window-settings");

    if (settingsElem) {
        settingsWindow.notify();
        return;
    }

    settingsWindow = new Window("Settings", "window-settings");
    settingsWindow.setClientTemplate("settings");
    pushWindowToStack(settingsWindow);
}

updateDate(); // Update immediately
setInterval(updateDate, 1000); // Update every second


const win1 = new Window("Window 1", "win1");
win1.winClientElem.innerHTML = "<h1>Header 1</h1><h2>Header 2</h2><h3> Header 3</h3><h4>Header 4</h4><h5>Header 5</h5><h6>Header 6</h6><p>This is in the div</p><p>This is in the <b>div</b></p><p>This is in the <i>div</i></p>";

const win2 = new Window("Window 2", "win2");
win2.winClientElem.innerHTML = "<p>This is in the div</p><p>This is in the <b>div</b></p><p>This is in the <i>div</i></p>";

const win3 = new Window("Window 3", "win3");

pushWindowToStack(win1);
pushWindowToStack(win2);
pushWindowToStack(win3);
