const baseURL = "https://api.github.com/users/";
let currentPage = 1;
const reposPerPage = 10;

function getRepositories() {
    const username = document.getElementById("username").value.trim(); // Trim to remove leading/trailing spaces
    if (!username) {
        // Show error message for empty username
        alert("Please enter a valid GitHub username.");
        return;
    }

    const url = `${baseURL}${username}/repos?page=${currentPage}&per_page=${reposPerPage}`;

    // Show loader
    document.getElementById("loader").style.display = "block";

    // Make API call to get user information
    fetch(`${baseURL}${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching user information: ${response.statusText}`);
            }
            return response.json();
        })
        .then(user => {
            // Hide loader
            document.getElementById("loader").style.display = "none";

            // Display user profile information
            const profileLink = document.getElementById("profileLink");
            profileLink.href = user.html_url; // Set the href attribute to the user's GitHub profile
            document.getElementById("profilePhoto").src = user.avatar_url  ;
            document.getElementById("profileName").innerText = user.name || user.login;
            document.getElementById("bio").innerText = user.bio || "No bio available";
        })
        .catch(error => {
            console.error(error.message);
            // Handle error (e.g., show an error message to the user)
            alert(`Error fetching user information: ${error.message}`);
        });

    // Make API call to get repositories
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Display repositories
            displayRepositories(data);

            // Update pagination information
            totalRepos = data.length > 0 ? data[0].owner.public_repos : 0;
            updatePagination();
        })
        .catch(error => {
            console.error(error.message);
            // Handle error 
            alert(`Error fetching repositories: ${error.message}`);
        });
}

function displayRepositories(repositories) {
    const repositoriesContainer = document.getElementById("repositories");
    repositoriesContainer.innerHTML = ""; // Clear previous content

    repositories.forEach(repo => {
        const repoDiv = document.createElement("div");
        repoDiv.className = "repo";
        repoDiv.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description"}</p>
            <div class="tags">${repo.language ? `<span class="tag">${repo.language}</span>` : ''}</div>
            <a href="${repo.html_url}" target="_blank" class="repo-link">View on GitHub</a>
        `;
        repositoriesContainer.appendChild(repoDiv);
    });
}

function updatePagination() {
    const totalPages = Math.ceil(totalRepos / reposPerPage);
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;

    document.getElementById("currentPage").innerText = `Page ${currentPage} of ${totalPages || 0}`;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        getRepositories();
    }
}

function nextPage() {
    currentPage++;
    getRepositories();
}
