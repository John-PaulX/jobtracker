const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// ---------------- LOGIN ----------------

if (loginForm) {

    loginForm.addEventListener("submit", loginUser);

}

async function loginUser(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {

        const response = await fetch(`${API_BASE_URL}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        if (!response.ok) {
            throw new Error("Invalid email or password");
        }

        const token = await response.text();

        localStorage.setItem("token", token);

        window.location.href = "dashboard.html";

    } catch (error) {

        alert(error.message);

    }

}

// ---------------- REGISTER ----------------

if (registerForm) {

    registerForm.addEventListener("submit", registerUser);

}

async function registerUser(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        console.log("API_BASE_URL =", API_BASE_URL);

        const response = await fetch(`${API_BASE_URL}/auth/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })

        });

        if (!response.ok) {
            throw new Error("Registration failed");
        }

        alert("Registration successful. Please login.");

        window.location.href = "index.html";

    } catch (error) {

        alert(error.message);

    }

}