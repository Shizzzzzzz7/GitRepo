let username = "";
let perPage = 10;
let currentPage = 1;
let repositories = [];

document.addEventListener("DOMContentLoaded", () => {
    searchUser();
});

function showLoader() {
    document.getElementById("loader").style.display = "block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

function searchUser() {
    username = document.getElementById("username").value.trim();
    if (username !== "") {
        currentPage = 1;
        getUserInfo();
        getRepositories();
    } else {
        document.getElementById("user-info").innerHTML = "";
        document.getElementById("repositories").innerHTML = "";
    }
}

function getUserInfo() {
    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(data => {
            const userInfo = document.getElementById("user-info");
            userInfo.innerHTML = `
                <img src="${data.avatar_url}" alt="Profile Image" id="profile-image">
                <div id="profile-details">
                    <h2>${data.name}</h2>
                    <p id="user-bio">${data.bio}</p>
                    <p id="user-location"><b>Location:</b> ${data.location}</p>
                </div>
            `;
        })
        .catch(error => console.error(error));
}

function getRepositories() {
    showLoader();
    perPage = parseInt(document.getElementById("perPage").value);
    fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            hideLoader();
            repositories = data;
            displayRepositories(data);
            updatePaginationButtons(data);
            updatePageNumbers();
        })
        .catch(error => {
            hideLoader();
            console.error(error);
        });
}

function displayRepositories(repositories) {
    const repoContainer = document.getElementById("repositories");
    repoContainer.innerHTML = "";

    repositories.forEach(repo => {
        const repoElement = document.createElement("div");
        repoElement.classList.add("repo");
        repoElement.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description}</p>
            <p>Topics: <span class="tpcs">${repo.topics.join(', ')}<span></p>
        `;
        repoContainer.appendChild(repoElement);
    });
}

function updatePaginationButtons(data) {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (data.length === 0) {
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    } else {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = data.length < perPage;
    }
}

function updatePageNumbers() {
    const totalPages = Math.ceil(repositories.length / perPage);
    const currentPageElement = document.getElementById("currentPage");
    const totalPagesElement = document.getElementById("totalPages");

    currentPageElement.textContent = currentPage;
    totalPagesElement.textContent = totalPages;
}

function goToPage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next') {
        currentPage++;
    }

    getRepositories();
}

function filterRepositories() {
    const searchInput = document.getElementById("search").value.toLowerCase();
    const filteredRepositories = repositories.filter(repo => repo.name.toLowerCase().includes(searchInput));
    displayRepositories(filteredRepositories);
    updatePaginationButtons(filteredRepositories);
    updatePageNumbers();
}