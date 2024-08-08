function setFlashMessageFadeOut() {
  const messageElement = document.querySelector(".flash-message");
  if (messageElement) {
    setTimeout(() => {
      let currentOpacity = 1.0;
      let timer = setInterval(() => {
        if (currentOpacity <= 0.05) {
          clearInterval(timer);
          messageElement.remove();
        }
        currentOpacity -= 0.05;
        messageElement.style.opacity = currentOpacity;
      }, 15);
    }, 4000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setFlashMessageFadeOut();
});
