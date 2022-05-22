const longURL = document.querySelector("#url-to-shorten");
const shortenURLButton = document.querySelector("#shorten-url-button");
const form = document.querySelector("#URLForm");

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateRandomURL = (length) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * 62));
  }
  return result;
};

function copyToClipBoard(URLToCopy) {
  console.log("Copied IG");
  const cb = navigator.clipboard;
  cb.writeText(URLToCopy).then(() => alert("URL Copied"));
}

const displayURL = (URL) => {
  const urlToShow = "https://redis-url-shortner-backend-production.up.railway.app/" + URL;
  document.getElementById("urlcontainer").innerHTML = urlToShow;
  document.getElementById("urlcontainer").href = URL;
  copyToClipBoard(urlToShow);
};

async function sendJSON(URLJSON) {
  var response = "Redis Server Error";
  try {
    response = await fetch("http://localhost:4000", {
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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const URL = longURL.value;
  const randURL = generateRandomURL(5);
  displayURL(randURL);
  sendJSON(JSON.stringify({ CPURL: randURL, UNCPURL: URL }));
});
