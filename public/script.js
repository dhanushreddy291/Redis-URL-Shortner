const longURL = document.querySelector("#url-to-shorten");
const form = document.querySelector("#URLForm");

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const setColor = (color) => {
  document
    .querySelector(":root")
    .style.setProperty("--color-primary", color, null);
};

const backGroundColors = [
  "#764AF1",
  "#FF4949",
  "#DEA057",
  "#FF8C32",
  "#F24A72",
  "#F0A500",
  "#5463FF",
  "#CC9544",
  "#5FD068",
  "#F47C7C",
  "#9772FB",
  "#F8B400",
  "#4D96FF",
  "#E84545",
  "#E8505B",
  "#FF9292",
];
setColor(backGroundColors[Math.floor(Math.random() * backGroundColors.length)]);

const generateRandomURL = (length) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * 62));
  }
  return result;
};

function copyToClipBoard(URLToCopy) {
  const cb = navigator.clipboard;
  cb.writeText(URLToCopy).then(() => alert("URL Copied"));
}

const displayURL = (URL) => {
  const urlToShow = window.location.href + URL;
  document.getElementById("urlcontainer").innerHTML = urlToShow;
  document.getElementById("urlcontainer").href = URL;
  copyToClipBoard(urlToShow);
};

async function sendJSON(URLJSON) {
  var response = "Redis Server Error";
  try {
    response = await fetch("/", {
      method: "POST",
      body: URLJSON,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    alert(err);
  }
  return response;
}

function validURL(link) {
  var valid = link.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return valid !== null;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  var URL = longURL.value;
  if (!(URL.indexOf("http://") === 0 || URL.indexOf("https://") === 0)) {
    URL = "http://" + URL;
  }
  if (!validURL(URL)) {
    alert("Enter a Valid URL");
  } else {
    const randURL = generateRandomURL(5);
    displayURL(randURL);
    sendJSON(JSON.stringify({ CPURL: randURL, UNCPURL: URL }));
  }
});
