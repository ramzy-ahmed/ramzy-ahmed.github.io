// Show all projects
ShwoAllProjects('https://gist.githubusercontent.com/ramzy-ahmed/8174f35a6ea699bebef04fe877745899/raw/projects.json?timestamp=1699900000');
               
function ShwoAllProjects(projectsFile) {
  fetch(projectsFile)
    .then(res => res.json())
    .then(data => {
      const allContainers = document.querySelectorAll('[data-category]');
      
      allContainers.forEach(container => {
        const category = container.getAttribute('data-category');
        const projects = data.projects.filter(p => p.category === category);

        projects.forEach((p, idx) => {
          const card = document.createElement('article');
          card.className = 'card';
          card.innerHTML = `
            <div class="project-image" data-index="${idx}">
              <img src="${p.image}" alt="${p.title}">
            </div>
            <div class="project-content">
              <div class="project-title">
                <h3>${p.title}</h3>
                <span class="toggle-arrow">▾</span>
              </div>
              <div class="details" aria-hidden="true">
                <div class="details-inner">
                  <p>${p.description}</p>
                  <h4 style="margin:10px 0 6px;color:var(--primary-color)">Features</h4>
                  <ul class="project-features">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
                  <h4 style="margin:10px 0 6px;color:var(--primary-color)">Tech Stack</h4>
                  <div class="project-tags">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
                  <div class="project-links">
                    ${p.github ? `<a class="btn-github" href="${p.github}" target="_blank"><i class="fab fa-github"></i>View Code</a>` : ''}
                    ${p.demo ? `<a class="btn-github" href="${p.demo}" target="_blank"><i class="fas fa-eye"></i>View Demo</a>` : ''}
                  </div>
                </div>
              </div>
            </div>
          `;
          // Add events
          const img = card.querySelector('.project-image');
          const title = card.querySelector('.project-title');
          img.addEventListener('click', () => toggleCard(card));
          title.addEventListener('click', () => toggleCard(card));

          container.appendChild(card);
        });
      });
    });
}

// toggle logic
function toggleCard(card) {
  const currentlyOpen = document.querySelector('.card.open');
  if (currentlyOpen && currentlyOpen !== card) closeCard(currentlyOpen);
  card.classList.contains('open') ? closeCard(card) : openCard(card);
}
function openCard(card) {
  const details = card.querySelector('.details');
  details.style.maxHeight = details.scrollHeight + 'px';
  details.style.padding = '12px 18px';
  details.setAttribute('aria-hidden', 'false');
  card.classList.add('open');
}
function closeCard(card) {
  const details = card.querySelector('.details');
  details.style.maxHeight = null;
  details.style.padding = '0 18px';
  details.setAttribute('aria-hidden', 'true');
  card.classList.remove('open');
}
document.addEventListener('click', (e) => {
  const insideCard = e.target.closest('.card');
  if (!insideCard){
    const openCardEl = document.querySelector('.card.open');
    if (openCardEl) closeCard(openCardEl);
  }
});