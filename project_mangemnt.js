class ProjectManager {
  constructor() {
    this.imageModal = document.getElementById('imageDialog');
    this.modalImage = document.getElementById('modalImage');
    this.closeModal = document.getElementById('closeModal');
    // تحقق: هل تم العثور على عنصر الديالوج؟
    if (!this.imageModal) {
      console.error("⛔ فشل: لم يتم العثور على عنصر <dialog id='imageModal'>. تحقق من ID.");
      return; // توقف عن تنفيذ الكلاس إذا لم يتم العثور عليه
    }

    // تحقق: هل تم العثور على زر الإغلاق؟
    if (!this.closeModal) {
      console.warn("⚠️ تنبيه: لم يتم العثور على زر الإغلاق <button id='closeModal'>.");
    }

    console.log("✅ نجاح: تم العثور على عنصر الديالوج والتهيئة جارية.");

    this.addModalEventListeners();
  }

  // Fetches project data and renders all projects
  async fetchAndShowProjects(projectsFile) {
    try {
      const response = await fetch(projectsFile);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      this.renderProjects(data.projects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }

  // Renders projects into their respective containers
  renderProjects(projects) {
    const allContainers = document.querySelectorAll('[data-category]');
    allContainers.forEach(container => {
      const category = container.getAttribute('data-category');
      const filteredProjects = projects.filter(p => p.category === category);
      filteredProjects.forEach((p, idx) => {
        const card = this.createProjectCard(p, idx);
        container.appendChild(card);
        this.initSlider(card, p.images.length);
      });
    });
  }

  // Creates a single project card element
  createProjectCard(project, index) {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="project-image">
        <div class="image-slider" id="slider-${index}">
          <div class="slider-container">
            ${project.images.map(img => `<img src="${img}" alt="${project.title}" class="slider-image" loading="lazy">`).join('')}
          </div>
          <div class="slider-nav">
            ${project.images.map((_, i) => `<div class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('')}
          </div>
          <div class="slider-arrows">
            <button class="slider-arrow prev" title="prev" aria-label="Toggle prev"><i class="fas fa-chevron-left"></i></button>
            <button class="slider-arrow next" title="next" aria-label="Toggle next"><i class="fas fa-chevron-right"></i></button>
          </div>
          <div class="slider-controls">
            <button class="control-btn play-pause" title="play pause" aria-label="Toggle play pause">
              <i class="fas fa-play"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="project-content">
        <div class="project-title">
          <h3>${project.title}</h3>
          <span class="toggle-arrow">▾</span>
        </div>
        <div class="details" aria-hidden="true">
          <div class="details-inner">
            <p>${project.description}</p>
            <h4 style="margin:10px 0 6px;color:var(--primary-dark)">Features</h4>
            <ul class="project-features">${project.features.map(f => `<li>${f}</li>`).join('')}</ul>
            <h4 style="margin:10px 0 6px;color:var(--primary-dark)">Tech Stack</h4>
            <div class="project-tags">${project.tech.map(t => `<span>${t}</span>`).join('')}</div>
            <div class="project-linkse">
              ${project.github ? `<a class="btn-github" href="${project.github}" target="_blank"><i class="fab fa-github"></i>View Code</a>` : ''}
              ${project.demo ? `<a class="btn-github demo" href="${project.demo}" target="_blank"><i class="fas fa-eye"></i>View Demo</a>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    card.querySelector('.project-title').addEventListener('click', () => this.toggleCard(card));
    return card;
  }

  // Initializes the image slider for a given card
  initSlider(card, totalImages) {
    const slider = card.querySelector('.image-slider');
    if (!slider) return;

    const container = slider.querySelector('.slider-container');
    const dots = slider.querySelectorAll('.slider-dot');
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    const playPauseBtn = slider.querySelector('.play-pause');
    const playIcon = playPauseBtn.querySelector('i');
    const images = slider.querySelectorAll('.slider-image');

    let currentIndex = 0;
    let autoPlayInterval;
    let isPlaying = true;

    const updateSlider = () => {
      container.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % totalImages;
      updateSlider();
    };

    const prevSlide = () => {
      if (currentIndex === 0) {
        currentIndex = totalImages;
      }
      currentIndex = (currentIndex - 1) % totalImages;
      updateSlider();
    };

    const startAutoPlay = () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, 2000);
      playIcon.classList.remove('fa-play');
      playIcon.classList.add('fa-pause');
      isPlaying = true;
    };

    const stopAutoPlay = () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
      playIcon.classList.remove('fa-pause');
      playIcon.classList.add('fa-play');
      isPlaying = false;
    };

    const toggleAutoPlay = () => isPlaying ? stopAutoPlay() : startAutoPlay();

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
      if (isPlaying) { stopAutoPlay(); startAutoPlay(); }
    });

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
      if (isPlaying) { stopAutoPlay(); startAutoPlay(); }
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = i;
        updateSlider();
        if (isPlaying) { stopAutoPlay(); startAutoPlay(); }
      });
    });

    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAutoPlay();
    });

    images.forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openImageModal(img.src);
      });
    });

    startAutoPlay();
  }

  // Toggles the details section of a project card
  toggleCard(card) {
    const currentlyOpen = document.querySelector('.card.open');
    if (currentlyOpen && currentlyOpen !== card) {
      this.closeCard(currentlyOpen);
    }
    card.classList.contains('open') ? this.closeCard(card) : this.openCard(card);
  }

  openCard(card) {
    const details = card.querySelector('.details');
    details.style.maxHeight = details.scrollHeight + 'px';
    details.style.padding = '12px 18px';
    details.setAttribute('aria-hidden', 'false');
    card.classList.add('open');
  }

  closeCard(card) {
    const details = card.querySelector('.details');
    details.style.maxHeight = null;
    details.style.padding = '0 18px';
    details.setAttribute('aria-hidden', 'true');
    card.classList.remove('open');
  }

  // Opens the image modal
  openImageModal(src) {
    this.modalImage.src = src;
    this.imageModal.showModal();
  }

  // Adds event listeners for the image modal
  addModalEventListeners() {
    this.closeModal.addEventListener('click', () => {
      this.imageModal.close();
    });
    document.addEventListener('click', (e) => {
      const insideCard = e.target.closest('.card');
      if (!insideCard) {
        const openCardEl = document.querySelector('.card.open');
        if (openCardEl) this.closeCard(openCardEl);
      }
    });
  }
}

// Initialize the ProjectManager
const projectManager = new ProjectManager();
projectManager.fetchAndShowProjects("https://gist.githubusercontent.com/ramzy-ahmed/8174f35a6ea699bebef04fe877745899/raw/projects.json?timestamp=1699900000");