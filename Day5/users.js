
const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

let users = [];

function renderUsers(list) {
    usersList.replaceChildren();

    if (list.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No users match your filter.";
        usersList.appendChild(li);
        return;
    }

    list.forEach((user) => {
        const li = document.createElement("li");

        const name = document.createElement("h2");
        name.textContent = user.name;

        const email = document.createElement("p");
        email.textContent = `Email: ${user.email}`;

        const city = document.createElement("p");
        city.textContent = `City: ${user.address.city}`;

        const company = document.createElement("p");
        company.textContent = `Company: ${user.company.name}`;

        li.append(name, email, city, company);
        usersList.appendChild(li);
    });
}

async function loadUsers() {
    statusText.textContent = "Loading users...";
    loadButton.disabled = true;
    usersList.replaceChildren();

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        users = await response.json();

        const searchText = filterInput.value.trim().toLowerCase();
        const filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(searchText)
        );

        renderUsers(filteredUsers);
        statusText.textContent = `Loaded ${users.length} users.`;
    } catch (error) {
        users = [];
        statusText.textContent =
            "Could not load users. Please try again.";
        console.error("Error loading users:", error);
    } finally {
        loadButton.disabled = false;
    }
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
    const searchText = filterInput.value.trim().toLowerCase();

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchText)
    );

    renderUsers(filteredUsers);
});
