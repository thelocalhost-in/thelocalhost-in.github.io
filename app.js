// Global variable to store all projects fetched from the JSON file
let allProjects = [];
const projectsContainer = document.getElementById("projectsContainer");
const searchInput = document.getElementById("searchInput");

/**
 * Renders a single project card's HTML.
 * @param {object} project - The project data object.
 * @returns {string} The HTML string for the project card.
 */
function createProjectCard(project) {
  const tagsHtml = project.tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");

  return `
    <div class="project-card">
      <img src="${project.imageUrl}" alt="${project.title}">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tags">${tagsHtml}</div>
      <a href="${project.link}" target="_blank">View Project</a>
    </div>
  `;
}

/**
 * Clears the container and displays the given array of projects.
 * @param {array} projectsToDisplay - The filtered or full array of projects.
 */
function displayProjects(projectsToDisplay) {
  // Clear previous content
  projectsContainer.innerHTML = "";

  if (projectsToDisplay.length === 0) {
    projectsContainer.innerHTML =
      "<p>No projects found matching your criteria.</p>";
    return;
  }

  // Generate and inject new content
  const html = projectsToDisplay.map(createProjectCard).join("");
  projectsContainer.innerHTML = html;
}

/**
 * Filters the projects based on the current search input value.
 */
function filterProjects() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === "") {
    // If search is empty, display all projects
    displayProjects(allProjects);
    return;
  }

  const filtered = allProjects.filter((project) => {
    // Check project title
    const titleMatch = project.title.toLowerCase().includes(searchTerm);

    // Check project description
    const descriptionMatch = project.description
      .toLowerCase()
      .includes(searchTerm);

    // Check project tags
    const tagsMatch = project.tags.some((tag) =>
      tag.toLowerCase().includes(searchTerm)
    );

    return titleMatch || descriptionMatch || tagsMatch;
  });

  displayProjects(filtered);
}

/**
 * Initializes the application: fetches data and sets up event listeners.
 */
function initializePortfolio() {
  // 1. Fetch the project data
  fetch("projects.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Store the full project list globally
      allProjects = data;

      // Display all projects initially
      displayProjects(allProjects);

      // 2. Add the search filter listener
      searchInput.addEventListener("input", filterProjects);
    })
    .catch((error) => {
      console.error("Failed to load project data:", error);
      projectsContainer.innerHTML =
        "<p>Error loading projects. Please check the console.</p>";
    });
}

// Start the application when the DOM is ready
document.addEventListener("DOMContentLoaded", initializePortfolio);
