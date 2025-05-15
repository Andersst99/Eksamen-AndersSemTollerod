const crudUrl =
  "https://crudcrud.com/api/8c755c3eed624784934f166d001ef68f/users";

// Registrer ny bruker
document.getElementById("register-btn").addEventListener("click", async () => {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;

  if (!username || !password) return alert("Fyll ut begge felt!");

  const newUser = { username, password };

  try {
    const response = await fetch(crudUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    console.log("Statuskode registrering:", response.status);

    if (response.ok) {
      alert("Bruker registrert!");
    } else {
      alert("Noe gikk galt ved registrering.");
    }
  } catch (error) {
    console.error("Feil ved registrering:", error);
  }
});

// Logg inn
document.getElementById("login-btn").addEventListener("click", async () => {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  if (!username || !password) return alert("Fyll ut begge felt!");

  try {
    const response = await fetch(crudUrl);
    const users = await response.json();

    console.log("Statuskode henting:", response.status);

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      window.location.href = "dating.html"; // Videre til side 2
    } else {
      alert("Feil brukernavn eller passord.");
    }
  } catch (error) {
    console.error("Feil ved innlogging:", error);
  }
});
