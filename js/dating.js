const crudUrl = "https://crudcrud.com/api/8c755c3eed624784934f166d001ef68f";
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const userEndpoint = `${crudUrl}/users`;
const likesEndpoint = `${crudUrl}/likes`;

if (!loggedInUser) {
  alert("Du må være logget inn for å bruke datingappen.");
  window.location.href = "index.html";
}

// Vis brukerprofil
const profileInfo = document.getElementById("profile-info");
function renderProfile() {
  profileInfo.innerText = `Brukernavn: ${loggedInUser.username}, Bosted: ${
    loggedInUser.location || "Ukjent"
  }`;
}
renderProfile();

// Rediger profil
document.getElementById("edit-profile-btn").addEventListener("click", () => {
  document.getElementById("edit-form").style.display = "block";
});

document
  .getElementById("save-profile-btn")
  .addEventListener("click", async () => {
    const newLocation = document.getElementById("edit-location").value;
    if (!newLocation) return alert("Fyll inn bosted");

    const { _id, ...userWithoutId } = loggedInUser;
    const updatedUser = { ...userWithoutId, location: newLocation };

    try {
      const response = await fetch(`${userEndpoint}/${loggedInUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      console.log("Statuskode oppdatering:", response.status);

      if (response.ok) {
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        location.reload();
      }
    } catch (err) {
      console.error("Feil ved oppdatering:", err);
    }
  });

// Filter
document.getElementById("save-filter-btn").addEventListener("click", () => {
  const gender = document.getElementById("gender-filter").value;
  const age = document.getElementById("age-filter").value;
  const filter = { gender, age: parseInt(age) || 0 };
  localStorage.setItem("matchFilter", JSON.stringify(filter));
  alert("Filter lagret!");
  getUser();
});

function getFilter() {
  return (
    JSON.parse(localStorage.getItem("matchFilter")) || { gender: "", age: 0 }
  );
}

// Random user
let currentUser = null;
async function getUser() {
  const filter = getFilter();
  let url = "https://randomuser.me/api/";
  if (filter.gender) url += `?gender=${filter.gender}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const user = data.results[0];
    const age = user.dob.age;

    if (age >= filter.age) {
      currentUser = {
        name: `${user.name.first} ${user.name.last}`,
        age,
        location: user.location.city,
        picture: user.picture.large,
      };
      localStorage.setItem("currentMatch", JSON.stringify(currentUser));
      renderUser(currentUser);
    } else {
      getUser();
    }
  } catch (err) {
    console.error("Feil ved henting av bruker:", err);
  }
}

// Vis random bruker
function renderUser(user) {
  const container = document.getElementById("user-card");
  container.innerHTML = `
    <img src="${user.picture}" alt="Profilbilde"><br />
    <strong>${user.name}</strong><br />
    Alder: ${user.age}<br />
    Bosted: ${user.location}
  `;
}

// Last likes ved oppstart
window.addEventListener("DOMContentLoaded", () => {
  const filter = getFilter();
  document.getElementById("gender-filter").value = filter.gender;
  document.getElementById("age-filter").value = filter.age || "";

  const savedMatch = JSON.parse(localStorage.getItem("currentMatch"));
  if (savedMatch) {
    currentUser = savedMatch;
    renderUser(currentUser);
  } else {
    getUser();
  }

  loadLikes();
});

// Last likes
async function loadLikes() {
  try {
    const response = await fetch(likesEndpoint);
    const data = await response.json();
    const myLikes = data.filter((like) => like.userId === loggedInUser._id);

    const container = document.getElementById("likes-container");
    container.innerHTML = "";

    myLikes.forEach((like) => {
      const el = document.createElement("div");
      el.innerHTML = `
        <img src="${like.likedUser.picture}" width="50">
        <strong>${like.likedUser.name}</strong> (${like.likedUser.age}) - ${
        like.likedUser.location
      }
        ${like.likedUser.rose ? "🌹" : ""}
        <button data-id="${like._id}" class="delete-like-btn">Slett</button>
      `;
      container.appendChild(el);
    });
  } catch (err) {
    console.error("Feil ved henting av likes:", err);
  }
}

// Event delegation for slett
document
  .getElementById("likes-container")
  .addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-like-btn")) {
      const id = e.target.dataset.id;

      try {
        const response = await fetch(`${likesEndpoint}/${id}`, {
          method: "DELETE",
        });

        console.log("Statuskode sletting:", response.status);
        if (response.ok) {
          loadLikes();
        }
      } catch (err) {
        console.error("Feil ved sletting:", err);
      }
    }
  });

// LIKE
document.getElementById("like-btn").addEventListener("click", async () => {
  if (!currentUser) return;

  try {
    const response = await fetch(likesEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: loggedInUser._id,
        likedUser: currentUser,
      }),
    });

    console.log("Likte bruker - statuskode:", response.status);

    if (response.ok) {
      localStorage.removeItem("currentMatch");
      loadLikes();
      getUser();
    }
  } catch (err) {
    console.error("Feil ved lagring av like:", err);
  }
});

// NEI
document.getElementById("dislike-btn").addEventListener("click", () => {
  localStorage.removeItem("currentMatch");
  getUser();
});

//  Gi rose (tilleggsfunksjon)
document.getElementById("rose-btn").addEventListener("click", async () => {
  if (!currentUser) return;

  try {
    const response = await fetch(likesEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: loggedInUser._id,
        likedUser: { ...currentUser, rose: true },
      }),
    });

    console.log("Sendte rose - statuskode:", response.status);

    if (response.ok) {
      localStorage.removeItem("currentMatch");
      loadLikes();
      getUser();
    }
  } catch (err) {
    console.error("Feil ved sending av rose:", err);
  }
});

// SØK I LIKTE BRUKERE
document.getElementById("search-input").addEventListener("input", (e) => {
  const søkeord = e.target.value.toLowerCase();
  const likesDivs = document.querySelectorAll("#likes-container div");

  likesDivs.forEach((div) => {
    const navn = div.querySelector("strong").innerText.toLowerCase();
    div.style.display = navn.includes(søkeord) ? "block" : "none";
  });
});
