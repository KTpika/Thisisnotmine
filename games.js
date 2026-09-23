// Game files for KTpika/Thisisnotmine
let files = [
  "Puzzle.js",
  "Speed.js",
  "Vector.js",
  "cart_tools.js",
  "celeste_practice_mod.js",
  "duality.js",
  "index.js",
  "maddyx.js",
  "oldsite.js",
  "speed-reader.html"
];

const REPO_USER = "KTpika";
const REPO_NAME = "Thisisnotmine";
const REPO_BRANCH = "main";

function generateAllSections() {
  try {
    document.getElementById("lolbutton").remove();
  } catch (e) {}

  const allChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const filesByChar = {};
  allChars.forEach((char) => {
    filesByChar[char] = [];
  });

  files.forEach((file) => {
    const firstChar = file[0].toUpperCase();
    if (filesByChar[firstChar]) {
      filesByChar[firstChar].push(file);
    } else {
      filesByChar["0"].push(file);
    }
  });

  const container = document.getElementById("sections-container");
  allChars.forEach((char) => {
    const section = document.createElement("div");
    section.className = "letter-section";
    section.id = `section-${char}`;

    const header = document.createElement("div");
    header.className = "letter-header";
    header.textContent = char;
    section.appendChild(header);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "buttons-container";

    if (filesByChar[char].length > 0) {
      filesByChar[char].forEach((file) => {
        const btn = document.createElement("input");
        btn.type = "button";
        btn.value = file;
        btn.onclick = () => loadGame(file);
        btn.style.width = "100%";
        btn.style.height = "100%";
        buttonsContainer.appendChild(btn);
      });
    } else {
      section.classList.add("empty");
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "empty-message";
      emptyMsg.textContent = "No files";
      buttonsContainer.appendChild(emptyMsg);
    }

    section.appendChild(buttonsContainer);
    container.appendChild(section);
  });

  generateSidebar(allChars, filesByChar);
}

function loadGame(file) {
  const rawUrl = `https://cdn.jsdelivr.net/gh/${REPO_USER}/${REPO_NAME}@${REPO_BRANCH}/${encodeURIComponent(file)}?t=${Date.now()}`;

  if (file.toLowerCase().endsWith(".html")) {
    // Full HTML file: fetch it and write it straight into the new window
    fetch(rawUrl)
      .then((res) => res.text())
      .then((html) => {
        const newWin = window.open("about:blank", "_blank");
        if (newWin) {
          newWin.document.open();
          newWin.document.write(html);
          newWin.document.close();
        }
      })
      .catch((err) => alert("Could not load " + file + ": " + err));
  } else {
    // .js file: needs to be wrapped in a real HTML page with a <script> tag
    // so the browser actually executes it, instead of just showing raw text.
    const wrapperHtml = `<!DOCTYPE html>
<html>
<head><title>${file}</title>
<style>html,body{margin:0;padding:0;background:#000;height:100%;overflow:hidden;}</style>
</head>
<body>
<script src="${rawUrl}"><\/script>
</body>
</html>`;
    const newWin = window.open("about:blank", "_blank");
    if (newWin) {
      newWin.document.open();
      newWin.document.write(wrapperHtml);
      newWin.document.close();
    }
  }
}

function generateSidebar(allChars, filesByChar) {
  const sidebar = document.getElementById("sidebar");

  allChars.forEach((char) => {
    const btn = document.createElement("button");
    btn.className = "sidebar-btn";
    btn.textContent = char;

    if (filesByChar[char].length === 0) {
      btn.classList.add("empty");
    } else {
      btn.onclick = () => {
        const section = document.getElementById(`section-${char}`);
        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      };
    }

    sidebar.appendChild(btn);
  });
}

generateAllSections();
