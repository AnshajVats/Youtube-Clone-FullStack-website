const likeButton = document.getElementById("likeToggle");
const commentButton = document.getElementById("submitComment");

function addCommentToScreen(data, container) {
  let commentDiv = document.createElement("div");
  commentDiv.classList.add("comment"); // Add class for styling

  // Set the inner HTML of the comment div
  commentDiv.innerHTML = `
    <div class="commentDetails">
      <h3 class="comment-user">${data.username}</h3>
      <p class="comment-text">${data.text}</p>
      <div class="commentActions">
        <span class="comment-date">${new Date().toLocaleString("en", {
          dateStyle: "long",
          timeStyle: "medium",
        })}</span>
      </div>
    </div>
  `;

  // Append the comment div to the comment list container
  container.append(commentDiv);
}

if (commentButton) {
  commentButton.addEventListener("click", async function (ev) {
    try {
      const text = document.getElementById("commentInput");
      if (!text.value) return;
      const postId = commentButton.dataset.postid;
      var resp = await fetch(`/comments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.value, postId }),
      });
      const commentBox = document.getElementById("commentList");
      var data = await resp.json();
      if (data.status) {
        console.log(data);
        addCommentToScreen(data, commentBox);
        text.value = "";
      }
    } catch (error) {
      console.error(error);
    }
  });
}

if (likeButton) {
  likeButton.addEventListener("click", async function (ev) {
    try {
      const postId = ev.currentTarget.dataset.postid;
      var resp = await fetch(`/post/likes/${postId}`, {
        method: "POST",
      });
      var data = await resp.json();
      console.log(data);

      if (data.success) {
        var lb = document.getElementById("likeToggle");
        if (data.isLiked) {
          lb.classList.add("fa-thumbs-down");
          lb.classList.remove("fa-thumbs-up");
        } else {
          lb.classList.add("fa-thumbs-up");
          lb.classList.remove("fa-thumbs-down");
        }
        const likeCountElement = document.getElementById("likeCount");
        let currentCount = parseInt(likeCountElement.textContent);
        likeCountElement.textContent = data.isLiked
          ? currentCount + 1
          : currentCount - 1;
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  });
}
