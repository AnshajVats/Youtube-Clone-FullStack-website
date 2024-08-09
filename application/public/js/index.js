let totalPhotoCount = 0;

function updatePhotoCount() {
  totalPhotoCount--;
  document.getElementById("photo_count").innerHTML = totalPhotoCount;
}

function fadeOut(ev) {
  let div = ev.currentTarget;

  div.removeEventListener("click", fadeOut);
  let opacity = 1;
  let timer = setInterval(function () {
    opacity -= 0.1;
    div.style.opacity = opacity;
    if (opacity <= 0.1) {
      div.remove();
      clearInterval(timer);
      document.getElementById("photo_count").innerHTML =
        document.getElementById("main_content").childElementCount;
    }
  }, 50);
}

function buildCardJSAPI(data) {
  let cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", "card");
  let tittleTag = document.createElement("p");
  tittleTag.setAttribute("class", "card-title");
  tittleTag.appendChild(document.createTextNode(data.title));
  let imageTag = document.createElement("img");
  imageTag.setAttribute("src", data.url);
  imageTag.setAttribute("class", "card-image");
  imageTag.setAttribute("alt", "A image is here");
  cardDiv.appendChild(imageTag);
  cardDiv.appendChild(tittleTag);
  cardDiv.addEventListener("click", fadeOut);
  return cardDiv;
}
