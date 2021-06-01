document.addEventListener("DOMContentLoaded", () => {
    init();

    document.getElementById("github-form").addEventListener("submit", e => {
        e.preventDefault();

        document.getElementById("user-list").innerHTML = "";
        document.getElementById("repos-list").innerHTML = "";

        if (e.target[0].value === "Users") {
            fetch(`https://api.github.com/search/users?q=${e.target[1].value}`)
                .then(res => res.json())
                .then(result => result.items.forEach(renderUser));
            e.target.reset();
        } else if (e.target[0].value === "Repos") {
            fetch(`https://api.github.com/search/repositories?q=${e.target[1].value}:assembly&sort=stars&order=desc`)
                .then(res => res.json())
                .then (result => result.items.forEach(renderRepo));
            e.target.reset();
        }
    })
})

function init() {
    const selectButton = document.createElement("select");
    const optionUsers = document.createElement("option");
    const optionRepos = document.createElement("option");

    optionUsers.textContent = "Users";
    optionRepos.textContent = "Repos";

    selectButton.append(optionUsers, optionRepos);
    document.getElementById("search").insertAdjacentElement("beforebegin", selectButton);
}

function renderUser(user) {
    const item = document.createElement("li");
    const username = document.createElement("h3");
    const avatar = document.createElement("img");
    const url = document.createElement("a");

    username.textContent = user.login;
    avatar.src = user.avatar_url;
    url.href = user.url;
    url.innerHTML = "</br>Link to profile";

    document.getElementById("user-list").appendChild(item);
    item.append(username, avatar, url);

    avatar.addEventListener("click", () => {
        fetch(`https://api.github.com/users/${user.login}/repos`)
            .then(res => res.json())
            .then(repos => repos.forEach(repo => {
                const repoName = document.createElement("li");

                repoName.textContent = repo.name;

                item.appendChild(repoName);
            }))
    })
}

function renderRepo(repo) {
    const repoName = document.createElement("h3");
    
    repoName.textContent = repo.name;

    document.getElementById("repos-list").appendChild(repoName);
}