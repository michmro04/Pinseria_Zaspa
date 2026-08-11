// Referencje do elementów DOM
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// 1. Navbar & Przycisk Powrót na Górę przy scrollowaniu
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 2. Dark Mode
const sunSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1.22" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="22.78" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const moonSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        if (body.classList.contains('dark-theme')) {
            themeToggleBtn.innerHTML = sunSvg;
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggleBtn.innerHTML = moonSvg;
            localStorage.setItem('theme', 'light');
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        if (themeToggleBtn) themeToggleBtn.innerHTML = sunSvg;
    } else {
        if (themeToggleBtn) themeToggleBtn.innerHTML = moonSvg;
    }
});

// 3. Ochrona obrazków przed przeciąganiem
document.addEventListener('contextmenu', (event) => {
    if (event.target.tagName === 'IMG') event.preventDefault();
});

// 4. Observer dla animacji Fade-In
const fadeElements = document.querySelectorAll('.fade-in');
const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

fadeElements.forEach(element => appearOnScroll.observe(element));

// 5. Slider Zdjęć Hero
const wrapper = document.getElementById('slides-wrapper');
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('slider-dots');
const prevBtn = document.getElementById('prev-slide');
const nextBtn = document.getElementById('next-slide');

let currentSlide = 0;
let slideInterval;

if (slides.length > 0 && wrapper) {
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetInterval();
        });
        if (dotsContainer) dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        currentSlide = index;
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
            resetInterval();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            let nextIndex = (currentSlide + 1) % slides.length;
            goToSlide(nextIndex);
            resetInterval();
        });
    }

    function startInterval() {
        slideInterval = setInterval(() => {
            let nextIndex = (currentSlide + 1) % slides.length;
            goToSlide(nextIndex);
        }, 4000);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    startInterval();
}

// 6. ScrollSpy (Podświetlanie linków)
const pageSections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-center a');

const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active-link');
                }
            });
        }
    });
}, { threshold: 0.3 });

pageSections.forEach(section => scrollSpyObserver.observe(section));

// 7. Zakładki w sekcji Menu (Tabs)
const tabButtons = document.querySelectorAll('.tab-btn');
const menuCategories = document.querySelectorAll('.menu-category');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const category = button.getAttribute('data-category');

        menuCategories.forEach(cat => {
            if (cat.getAttribute('id') === category) {
                cat.classList.add('active');
            } else {
                cat.classList.remove('active');
            }
        });
    });
});

// 8. Pobieranie danych Menu z JSON + Ukrywanie Preloadera
function hidePreloader() {
    const preloader = document.getElementById('loader-wrapper');
    if (preloader) {
        preloader.classList.add('fade-out');
    }
}

async function loadMenuFromJSON() {
    try {
        const response = await fetch('menu.json');
        if (!response.ok) throw new Error(`Błąd sieci: ${response.status}`);
        const menuData = await response.json();

        Object.keys(menuData).forEach(categoryKey => {
            const container = document.querySelector(`#${categoryKey} .menu-grid`);
            if (container) {
                container.innerHTML = menuData[categoryKey].map(item => `
                    <div class="menu-list-item ${!item.image ? 'no-image' : ''}">
                        ${item.image ? `
                            <div class="menu-item-img-wrapper">
                                <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">
                            </div>
                        ` : ''}
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

document.addEventListener('DOMContentLoaded', loadMenuFromJSON);

// 9. Menu Hamburger mobilne
const hamburgerBtn = document.getElementById('hamburger-btn');
const navCenterMenu = document.getElementById('nav-center');

if (hamburgerBtn && navCenterMenu) {
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navCenterMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-center a').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navCenterMenu.classList.remove('active');
        });
    });
}

// ================================
// LOGIKA SKLEPIKU I KOSZYKA
// ================================

let cart = [];
let sklepProducts = [];

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

function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }
    updateCartUI();
}

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

function updateCartUI() {
    const countBadge = document.getElementById('cart-count-badge');
    const itemsList = document.getElementById('cart-items-list');
    const totalPriceEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('go-to-checkout-btn');

    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (countBadge) countBadge.innerText = totalCount;
    if (totalPriceEl) totalPriceEl.innerText = `${totalPrice} zł`;
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

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

    sklepProducts.forEach(prod => {
        const actionEl = document.getElementById(`prod-action-${prod.id}`);
        if (actionEl) {
            const cartItem = cart.find(item => item.id === prod.id);
            const qty = cartItem ? cartItem.qty : 0;
            const newHtml = renderProductActionHtml(prod.id, prod.name, prod.price, qty);
            
            if (actionEl.innerHTML.trim() !== newHtml.trim()) {
                actionEl.innerHTML = newHtml;
            }
        }
    });
}

// 10. Nawigacja koszyka & Obsługa Zamówienia
// 1. Otwieranie widoku formularza z re-aktywacją pól i przycisku
function showCheckoutView() {
    document.getElementById('cart-view-items').classList.remove('active');
    document.getElementById('cart-view-form').classList.add('active');

    const submitBtn = document.getElementById('submit-order-btn');
    const statusMsg = document.getElementById('order-status-msg');
    
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Złóż zamówienie i zapłać';
    }
    if (statusMsg) {
        statusMsg.style.display = 'none';
    }

    // Odblokowujemy pola tekstowe na wypadek nowego zamówienia
    document.querySelectorAll('#order-form input, #order-form textarea').forEach(input => {
        input.disabled = false;
    });
}

function showItemsView() {
    document.getElementById('cart-view-form').classList.remove('active');
    document.getElementById('cart-view-items').classList.add('active');
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.classList.remove('active');
    setTimeout(showItemsView, 300);
}

const cartFloatBtn = document.getElementById('cart-float-btn');
const cartOverlay = document.getElementById('cart-overlay');

if (cartFloatBtn) {
    cartFloatBtn.addEventListener('click', () => {
        const modal = document.getElementById('cart-modal');
        if (modal) modal.classList.add('active');
    });
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartModal);
}

// Obsługa wysyłki zamówienia na e-mail z komunikatem wewnątrz koszyka

// 2. Obsługa wysyłki zamówienia na e-mail (bez automatycznego zamykania)
async function handleOrderSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) return;

    const submitBtn = document.getElementById('submit-order-btn');
    const statusMsg = document.getElementById('order-status-msg');
    
    submitBtn.disabled = true;
    submitBtn.innerText = 'Wysyłanie zamówienia...';

    if (statusMsg) {
        statusMsg.className = 'order-status-msg';
        statusMsg.style.display = 'none';
        statusMsg.innerText = '';
    }

    const name = document.getElementById('client-name').value;
    const phone = document.getElementById('client-phone').value;
    const email = document.getElementById('client-email').value;
    const address = document.getElementById('client-address').value;
    const notes = document.getElementById('client-notes').value;

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let itemsText = cart.map(item => `- ${item.name} x${item.qty} (${item.price * item.qty} zł)`).join('\n');

    try {
        const response = await fetch('https://formsubmit.co/ajax/mrg.mrowicki@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `🛒 Nowe zamówienie w sklepiku: ${name}`,
                _template: 'table',
                'Imię i Nazwisko': name,
                'Telefon': phone,
                'E-mail klienta': email,
                'Adres dostawy': address,
                'Uwagi': notes || 'Brak',
                'Zamówione produkty': itemsText,
                'Suma do zapłaty': `${totalPrice} zł`
            })
        });

        if (response.ok) {
            // A. Czyszczenie koszyka i kafelków na stronie
            cart = [];
            updateCartUI();

            // B. Zablokowanie edycji wszystkich pól tekstowych
            document.querySelectorAll('#order-form input, #order-form textarea').forEach(input => {
                input.disabled = true;
            });

            // C. Wyświetlenie zielonego komunikatu sukcesu
            if (statusMsg) {
                statusMsg.innerText = 'Dziękujemy! Zamówienie zostało wysłane. Wkrótce odpowiemy na e-mail z danymi do przelewu.';
                statusMsg.className = 'order-status-msg success';
                statusMsg.style.display = 'block';
            }

            // D. Blokujemy przycisk wysyłki
            submitBtn.disabled = true;
            submitBtn.innerText = 'Zamówienie wysłane ✓';
        } else {
            if (statusMsg) {
                statusMsg.innerText = 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub zadzwoń do nas.';
                statusMsg.className = 'order-status-msg error';
                statusMsg.style.display = 'block';
            }
            submitBtn.disabled = false;
            submitBtn.innerText = 'Złóż zamówienie i zapłać';
        }
    } catch (error) {
        console.error('Błąd wysyłki zamówienia:', error);
        if (statusMsg) {
            statusMsg.innerText = 'Błąd połączenia. Sprawdź dostęp do sieci i spróbuj ponownie.';
            statusMsg.className = 'order-status-msg error';
            statusMsg.style.display = 'block';
        }
        submitBtn.disabled = false;
        submitBtn.innerText = 'Złóż zamówienie i zapłać';
    }
}
document.addEventListener('DOMContentLoaded', loadSklepProducts);