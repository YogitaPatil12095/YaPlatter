function showSection(sectionId) {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => section.classList.add("hidden")); // Hide all
    document.getElementById(sectionId).classList.remove("hidden");  // Show target
  }
  
  // GitHub Section (only fetch once)
  let githubLoaded = false;
  
  function loadGitHub() {
    if (githubLoaded) return;
    githubLoaded = true;
  
    const container = document.getElementById("github");
    const admiredDevs = ["torvalds", "gaearon", "sindresorhus", "thepracticaldev", "vercel"];
  
    admiredDevs.forEach((username) => {
      fetch(`https://api.github.com/users/${username}`)
        .then((res) => res.json())
        .then((data) => {
          const card = document.createElement("div");
          card.className = "bg-gray-800 p-4 rounded shadow hover:bg-gray-700 transition";
          card.innerHTML = `
            <div class="flex gap-4 items-center">
              <img src="${data.avatar_url}" class="w-16 h-16 rounded-full" />
              <div>
                <h3 class="text-xl">${data.name || data.login}</h3>
                <p class="text-sm">@${data.login}</p>
                <p class="text-sm text-gray-400">${data.followers} followers</p>
                <a href="${data.html_url}" class="text-yellow-400 hover:underline" target="_blank">View Profile</a>
              </div>
            </div>
          `;
          container.appendChild(card);
        });
    });
  }
  