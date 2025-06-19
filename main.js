
// Toggle mobile menu
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  nav.classList.toggle('show');
}

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('show');
  });
});

// Close menu when clicking outside
document.addEventListener('click', function (event) {
  const menu = document.getElementById('navLinks');
  const button = document.querySelector('.menu-toggle');
  if (menu.classList.contains('show')) {
    if (!menu.contains(event.target) && !button.contains(event.target)) {
      menu.classList.remove('show');
    }
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Particles.js configuration
const particlesDark = {
  particles: {
    number: { value: 100, density: { enable: true, value_area: 900 } },
    color: { value: ["#00f5d4", "#00bbf9", "#9b5de5", "#f15bb5"] },
    shape: {
      type: "circle",
      stroke: { width: 0, color: "#000" },
      polygon: { nb_sides: 8 }
    },
    opacity: {
      value: 0.6, random: true,
      anim: { enable: true, speed: 0.5, opacity_min: 0.5, sync: false }
    },
    size: {
      value: 6, random: true,
      anim: { enable: true, speed: 3, size_min: 0.8, sync: false }
    },
    line_linked: {
      enable: true, distance: 130,
      color: "#ffffff", opacity: 0.3, width: 1.5
    },
    move: {
      enable: true, speed: 2.5, direction: "none",
      random: false, straight: false, out_mode: "out",
      bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: ["grab", "bubble"] },
      onclick: { enable: true, mode: "repulse" },
      resize: true
    },
    modes: {
      grab: { distance: 160, line_linked: { opacity: 0.5 } },
      bubble: { distance: 200, size: 8, duration: 2, opacity: 0.8, speed: 3 },
      repulse: { distance: 100, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 }
    }
  },
  retina_detect: true
};


const particlesLight = JSON.parse(JSON.stringify(particlesDark));
particlesLight.particles.color.value = ["#006d77", "#83c5be", "#ff006e", "#ffd166"];
particlesLight.particles.line_linked.color = "#000000";


function loadParticles(theme) {
  const config = theme === 'light' ? particlesLight : particlesDark;

  
  if (window.pJSDom && window.pJSDom.length) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = []; 
  }

  let particlesContainer = document.getElementById('particles-js');
  if (!particlesContainer) {
    particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles-js';
    document.body.appendChild(particlesContainer);
  } else {
    particlesContainer.innerHTML = '';
  }
  particlesJS('particles-js', config);
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.innerHTML = currentTheme === 'light'
  ? '<i class="fas fa-moon"></i>'
  : '<i class="fas fa-sun"></i>';

loadParticles(currentTheme);

themeToggle.addEventListener('click', () => {
  let theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.innerHTML = theme === 'light'
    ? '<i class="fas fa-moon"></i>'
    : '<i class="fas fa-sun"></i>';
  loadParticles(theme);
});