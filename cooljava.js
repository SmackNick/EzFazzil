// cooljava.js

// Slider de la Sección Hero
const heroSlides = document.querySelectorAll('.hero-slide');
const heroPrev = document.querySelector('.hero-slider-controls .prev');
const heroNext = document.querySelector('.hero-slider-controls .next');
let heroIndex = 0;

// Check if hero slider exists before adding event listeners
if (heroSlides.length && heroPrev && heroNext) {
    function showHeroSlide(index) {
        heroSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    heroPrev.addEventListener('click', () => {
        heroIndex = heroIndex > 0 ? heroIndex - 1 : heroSlides.length - 1;
        showHeroSlide(heroIndex);
    });

    heroNext.addEventListener('click', () => {
        heroIndex = heroIndex < heroSlides.length - 1 ? heroIndex + 1 : 0;
        showHeroSlide(heroIndex);
    });

    // Automatic slide change every 5 seconds
    setInterval(() => {
        heroNext.click();
    }, 5000);
}

// Slider simple de testimonios
const testimonials = document.querySelectorAll('.testimonial-item');
let currentTestimonial = 0;

function showNextTestimonial() {
    testimonials[currentTestimonial].classList.remove('active');
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    testimonials[currentTestimonial].classList.add('active');
}

if (testimonials.length) {
    setInterval(showNextTestimonial, 5000);
}

// Desplazamiento suave para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Cambiar el fondo del encabezado al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Manejo del Acordeón de Subcategorías
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});

// Toggle for hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
console.log(hamburger, navLinks);  // Check if these elements exist in the page


if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });
}

// Ensure the page starts at the top when refreshed
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

// Reset the form on page load to clear previous input data
window.addEventListener('load', () => {
    const form = document.querySelector('.contact-form');
    form.reset(); // Clears all form fields
});
