document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".signUpForm");
  const usernameInput = form.querySelector('input[placeholder="Username"]');
  const passwordInput = form.querySelector('input[placeholder="Password"]');
  const confirmPasswordInput = form.querySelector(
    'input[placeholder=" Confirm Password"]'
  );
  const container = document.querySelector(".container");
  const errorDiv = document.createElement("div");

  container.appendChild(errorDiv);

  function showError(message) {
    const existingError = Array.from(errorDiv.children).find(
      (child) => child.textContent === message
    );

    if (!existingError) {
      const divTag = document.createElement("div");
      divTag.setAttribute("id", "error-message");
      errorDiv.setAttribute("class", "error-handle");
      divTag.textContent = message;
      errorDiv.appendChild(divTag);
    }
  }

  function clearErrors() {
    const errors = Array.from(errorDiv.children);
    errors.forEach((error) => error.remove());
  }

  function validateUsername() {
    const username = usernameInput.value.trim();
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,}$/;
    if (!usernameRegex.test(username)) {
      showError(
        "Username must start with a letter and be at least 3 alphanumeric characters long."
      );
      return false;
    }
    return true;
  }

  function validatePassword() {
    const password = passwordInput.value;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[/\*\-+!@#$^&~\[\]])[A-Za-z\d/\*\-+!@#$^&~\[\]]{8,}$/;
    if (!passwordRegex.test(password)) {
      showError(
        "Password must be at least 8 characters long, contain 1 uppercase letter, 1 number, and 1 special character (/ * - + ! @ # $ ^ & ~ [ ])."
      );
      return false;
    }
    return true;
  }

  function validateConfirmPassword() {
    if (passwordInput.value !== confirmPasswordInput.value) {
      showError("Passwords do not match.");
      return false;
    }
    return true;
  }

  form.addEventListener("submit", function (e) {
    clearErrors();

    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (!isUsernameValid || !isPasswordValid || !isConfirmPasswordValid) {
      e.preventDefault();
      form.reset();
    }
  });

  usernameInput.addEventListener("input", clearErrors);
  passwordInput.addEventListener("input", clearErrors);
  confirmPasswordInput.addEventListener("input", clearErrors);
});
