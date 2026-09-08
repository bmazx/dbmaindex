// update time
function updateDate() {
    const date = new Date();
    const dateFormat = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const timeFormat = String(date.getHours()).padStart(2, '0') + ":" +
                       String(date.getMinutes()).padStart(2, '0') + ":" +
                       String(date.getSeconds()).padStart(2, '0');

    document.getElementById("date").textContent = dateFormat + " - " + timeFormat;
}

updateDate();
setInterval(updateDate, 1000);

// toggle font
const statusFontBtn = document.getElementById("status-toggle-font");
let useSystem = sessionStorage.getItem("useSystemFont") === "true";

function toggleFont() {
    const font = useSystem
        ? "serif"
        : "mainFont, serif";

    document.documentElement.style.setProperty("--font-family", font);
}

statusFontBtn.addEventListener("click", () => {
    useSystem = !useSystem;
    sessionStorage.setItem("useSystemFont", useSystem);
    toggleFont();
});

toggleFont();


// project ----------------------------------------

function displayProject(card) {
    const templateElem = card.getElementsByTagName("template")[0];
    const projectContentElem = document.getElementById("project-content");
    const projectInfoElem = document.getElementById("project-info");

    projectContentElem.scrollTop = 0;

    const content = templateElem.content.cloneNode(true);

    while (projectInfoElem.firstChild) {
            projectInfoElem.removeChild(projectInfoElem.lastChild);
    }
    projectInfoElem.appendChild(content);

    // set background color for selected card
    const selCard = document.getElementById("sel-card");
    if (selCard) {
        selCard.style.color = "";
        selCard.id = "";
    }

    card.style.color = "var(--color-green)";
    card.id = "sel-card";
}

// index ----------------------------------------

const splashText = "O(2n)"

if (document.body.id === "index") {
    document.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            sessionStorage.setItem("titleClicked", "false");
        });
    });

    const titleSubtext = document.getElementById("main-title-subtext");
    const titleClicked = sessionStorage.getItem("titleClicked");
    if (titleClicked === "false") {
        const num = Math.floor(Math.random() * 10);
        if (num == 0) {
            titleSubtext.textContent = splashText;
        }
    }

    const colors = [ "pink", "red", "orange", "green", "yellow", "cyan", "purple" ];
    const date = new Date();
    const day = date.getDay();
    titleSubtext.style.color = `var(--color-${colors[day]})`
}
