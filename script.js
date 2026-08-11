// Referencje do elementów DOM
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// 1. Zmiana wyglądu paska nawigacji i pojawianie się strzałki podczas scrollowania
window.addEventListener('scroll', () => {
    // Jeśli zjechaliśmy w dół o więcej niż 80 pikseli
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Strzałka pojawia się po 300 pikselach
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// 2. Obsługa powrotu na górę po kliknięciu strzałki
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Definicje ikonek SVG, żeby kod był czytelny
const sunSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1.22" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="22.78" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

const moonSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

// 3. Obsługa trybu ciemnego (Dark Mode)
themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    
    // Zmiana ikonki SVG w zależności od aktywnego trybu
    if (body.classList.contains('dark-theme')) {
        themeToggleBtn.innerHTML = sunSvg;
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggleBtn.innerHTML = moonSvg;
        localStorage.setItem('theme', 'light');
    }
});

// 4. Sprawdzanie preferencji użytkownika przy ładowaniu strony
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggleBtn.innerHTML = sunSvg;
    } else {
        themeToggleBtn.innerHTML = moonSvg;
    }
});

// 5. Blokada menu kontekstowego na zdjęciach (Zapisz jako / Otwórz w nowej karcie)
document.addEventListener('contextmenu', (event) => {
    // Sprawdzamy, czy kliknięty element to obrazek
    if (event.target.tagName === 'IMG') {
        event.preventDefault(); // Zatrzymuje domyślną akcję przeglądarki
    }
});


// 6. Animacja pojawiania się elementów przy scrollowaniu (Intersection Observer)
// Szukamy wszystkich elementów z klasą .fade-in (w naszym przypadku sekcja Spody)
const fadeElements = document.querySelectorAll('.fade-in');

// Konfigurujemy obserwatora
const appearOptions = {
    threshold: 0.2, // Animacja odpali się, gdy 20% elementu pojawi się na ekranie
    rootMargin: "0px 0px -50px 0px" // Delikatne opóźnienie wyzwolenia przed samym dołem ekranu
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return; // Jeśli elementu nie widać, nic nie rób
        } else {
            entry.target.classList.add('appear'); // Dodaj klasę aktywującą przejście CSS
            observer.unobserve(entry.target); // Przestań obserwować po jednorazowym odpaleniu
        }
    });
}, appearOptions);

// Przypisujemy obserwatora do znalezionych elementów
fadeElements.forEach(element => {
    appearOnScroll.observe(element);
});

// 7. Slider zdjęć w sekcji Hero (Przesuwanie, kropki i strzałki)
const wrapper = document.getElementById('slides-wrapper');
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('slider-dots');
const prevBtn = document.getElementById('prev-slide');
const nextBtn = document.getElementById('next-slide');

let currentSlide = 0;
let slideInterval;

if (slides.length > 0) {
    // 1. Generowanie kropek
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetInterval();
        });
        
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    // 2. Główna funkcja przesuwająca taśmę ze zdjęciami
    function goToSlide(index) {
        currentSlide = index;
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        dots.forEach(d => d.classList.remove('active'));
        dots[currentSlide].classList.add('active');
    }

    // 3. Obsługa lewej strzałki
    prevBtn.addEventListener('click', () => {
        // Zabezpieczenie przed ujemnym indeksem
        let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
        resetInterval();
    });

    // 4. Obsługa prawej strzałki
    nextBtn.addEventListener('click', () => {
        let nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
        resetInterval();
    });

    // 5. Automatyczne przesuwanie
    function startInterval() {
        slideInterval = setInterval(() => {
            let nextIndex = (currentSlide + 1) % slides.length;
            goToSlide(nextIndex);
        }, 4000); // 4 sekundy
    }

    // 6. Resetowanie zegara po ręcznym kliknięciu
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    startInterval();
}

// 8. Podświetlanie linków w nawigacji podczas scrollowania (ScrollSpy)
// Pobieramy wszystkie główne sekcje na stronie i wszystkie linki z paska
const pageSections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-center a');

// Konfigurujemy obserwatora dla sekcji
const scrollSpyOptions = {
    root: null,
    rootMargin: '0px',
    // threshold: 0.3 oznacza, że sekcja musi zajmować co najmniej 30% wysokości ekranu, 
    // aby skrypt uznał, że użytkownik faktycznie na nią patrzy
    threshold: 0.3 
};

const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Jeśli sekcja pojawia się w polu widzenia
        if (entry.isIntersecting) {
            // Pobieramy jej ID (np. "home", "menu", "about")
            const currentId = entry.target.getAttribute('id');
            
            // Czyścimy wszystkie linki z aktywnej klasy
            navLinks.forEach(link => {
                link.classList.remove('active-link');
                
                // Jeśli atrybut href linku pasuje do ID sekcji (np. href="#menu" pasuje do id="menu")
                if (link.getAttribute('href') === `#${currentId}`) {
                    // Nadajemy aktywną klasę, która zmienia wygląd CSS
                    link.classList.add('active-link');
                }
            });
        }
    });
}, scrollSpyOptions);

// Zlecamy obserwatorowi śledzenie każdej sekcji na stronie
pageSections.forEach(section => {
    scrollSpyObserver.observe(section);
});

// 9. Obsługa podkarty w sekcji Menu (Tabs)
const tabButtons = document.querySelectorAll('.tab-btn');
const menuCategories = document.querySelectorAll('.menu-category');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Usuwamy klasę active ze wszystkich przycisków
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Dodajemy klasę active do klikniętego przycisku
        button.classList.add('active');

        // Pobieramy nazwę kategorii z atrybutu data-category
        const category = button.getAttribute('data-category');

        // Przechodzimy przez wszystkie podkarty menu
        menuCategories.forEach(cat => {
            if (cat.getAttribute('id') === category) {
                cat.classList.add('active');
            } else {
                cat.classList.remove('active');
            }
        });
    });
});

// Funkcja ukrywająca ekran ładowania z łagodnym zanikaniem
// Funkcja ukrywająca ekran ładowania
function hidePreloader() {
    const preloader = document.getElementById('loader-wrapper');
    if (preloader) {
        preloader.classList.add('fade-out');
    }
}

async function loadMenuFromJSON() {
    try {
        const response = await fetch('menu.json');
        if (!response.ok) {
            throw new Error(`Błąd sieci: ${response.status}`);
        }
        const menuData = await response.json();

        Object.keys(menuData).forEach(categoryKey => {
            const container = document.querySelector(`#${categoryKey} .menu-grid`);
            if (container) {
                container.innerHTML = menuData[categoryKey].map(item => `
                    <div class="menu-list-item ${!item.image ? 'no-image' : ''}">
                        <!-- Zdjęcie po lewej stronie -->
                        ${item.image ? `
                            <div class="menu-item-img-wrapper">
                                <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">
                            </div>
                        ` : ''}

                        <!-- Treść w środku -->
                        <div class="menu-item-content">
                            <div class="menu-item-header">
                                <h3>${item.name}</h3>
                                <div class="menu-item-badges">
                                    ${item.isBestseller ? '<span class="badge badge-bestseller">⭐ Bestseller</span>' : ''}
                                    ${item.isVege ? '<span class="badge badge-vege">🥬 Wege</span>' : ''}
                                    ${item.isSpicy ? '<span class="badge badge-spicy">🌶️ Ostre</span>' : ''}
                                </div>
                            </div>
                            <p class="menu-item-desc">${item.description}</p>
                            ${item.allergens ? `<span class="menu-item-allergens">ℹ️ ${item.allergens}</span>` : ''}
                        </div>

                        <!-- Cena po prawej stronie -->
                        <div class="menu-item-price-col">
                            <span class="price">${item.price}</span>
                        </div>
                    </div>
                `).join('');
            }
        });
    } catch (error) {
        console.error('Nie udało się załadować menu:', error);
    } finally {
        hidePreloader();
    }
}

// Wywołujemy ładowanie menu od razu po załadowaniu struktury HTML
document.addEventListener('DOMContentLoaded', loadMenuFromJSON);

// 10. Obsługa rozwijanego menu (Hamburger)
const hamburgerBtn = document.getElementById('hamburger-btn');
const navCenterMenu = document.getElementById('nav-center');

if (hamburgerBtn && navCenterMenu) {
    // Otwieranie / zamykanie po kliknięciu w hamburgera
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navCenterMenu.classList.toggle('active');
    });

    // Automatyczne zamykanie menu po kliknięciu w którykolwiek link
    document.querySelectorAll('.nav-center a').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navCenterMenu.classList.remove('active');
        });
    });
}

// ================================
// LOGIKA SKLEPIKU I KOSZYKA (Z INTERAKTYWNYMI LICZNIKAMI)
// ================================

let cart = [];
let sklepProducts = [];

// 1. Ładowanie produktów z pliku sklep.json
async function loadSklepProducts() {
    try {
        const response = await fetch('sklep.json');
        if (!response.ok) return;
        sklepProducts = await response.json();
        renderSklepGrid();
    } catch (err) {
        console.error('Błąd ładowania produktów sklepiku:', err);
    }
}

// 2. Generowanie siatki produktów w sklepiku
function renderSklepGrid() {
    const grid = document.getElementById('sklep-grid');
    if (!grid) return;

    grid.innerHTML = sklepProducts.map(prod => {
        const cartItem = cart.find(item => item.id === prod.id);
        const qty = cartItem ? cartItem.qty : 0;

        return `
            <div class="product-card" id="prod-card-${prod.id}">
                <img src="${prod.image}" alt="${prod.name}" loading="lazy">
                <h3>${prod.name}</h3>
                <p>${prod.description}</p>
                <div class="product-bottom">
                    <span class="product-price">${prod.price} ${prod.unit}</span>
                    <div class="product-action" id="prod-action-${prod.id}">
                        ${renderProductActionHtml(prod.id, prod.name, prod.price, qty)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 3. Generowanie HTML przycisku (Dodaj VS Licznik - +)
function renderProductActionHtml(id, name, price, qty) {
    if (qty > 0) {
        return `
            <div class="store-qty-control">
                <button class="store-qty-btn" onclick="changeQty('${id}', -1)" aria-label="Zmniejsz ilość">-</button>
                <span class="store-qty-num">${qty}</span>
                <button class="store-qty-btn" onclick="changeQty('${id}', 1)" aria-label="Zwiększ ilość">+</button>
            </div>
        `;
    } else {
        return `
            <button class="add-to-cart-btn" onclick="addToCart('${id}', '${name}', ${price})">+ Dodaj</button>
        `;
    }
}

// 4. Dodawanie do koszyka
function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }
    updateCartUI();
}

// 5. Zmiana ilości (działa zarówno dla kafelka, jak i dla koszyka)
function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    updateCartUI();
}

// Zoptymalizowana funkcja updateCartUI w script.js
function updateCartUI() {
    const countBadge = document.getElementById('cart-count-badge');
    const itemsList = document.getElementById('cart-items-list');
    const totalPriceEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (countBadge) countBadge.innerText = totalCount;
    if (totalPriceEl) totalPriceEl.innerText = `${totalPrice} zł`;
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

    // Aktualizacja listy w otwartym koszyku
    if (itemsList) {
        if (cart.length === 0) {
            itemsList.innerHTML = '<p style="text-align:center; opacity:0.6; margin-top:30px;">Twój koszyk jest pusty.</p>';
        } else {
            itemsList.innerHTML = cart.map(item => `
                <div class="cart-item-row">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price} zł x ${item.qty} = <strong>${item.price * item.qty} zł</strong></p>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Aktualizacja kontrolerów tylko na kafelkach sklepiku
    sklepProducts.forEach(prod => {
        const actionEl = document.getElementById(`prod-action-${prod.id}`);
        if (actionEl) {
            const cartItem = cart.find(item => item.id === prod.id);
            const qty = cartItem ? cartItem.qty : 0;
            const newHtml = renderProductActionHtml(prod.id, prod.name, prod.price, qty);
            
            // Podmieniamy HTML tylko jeśli uległ zmianie (unikamy zbędnych spięć w DOM)
            if (actionEl.innerHTML.trim() !== newHtml.trim()) {
                actionEl.innerHTML = newHtml;
            }
        }
    });
}

// 7. Otwieranie / zamykanie draweru koszyka
const cartFloatBtn = document.getElementById('cart-float-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartOverlay = document.getElementById('cart-overlay');

if (cartFloatBtn && cartModal) {
    cartFloatBtn.addEventListener('click', () => cartModal.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));
    cartOverlay.addEventListener('click', () => cartModal.classList.remove('active'));
}

document.addEventListener('DOMContentLoaded', loadSklepProducts);