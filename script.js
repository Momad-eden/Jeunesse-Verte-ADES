fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    // --- Activités ---
    const activitesContainer = document.getElementById("carousel-activites");
    data.activites.forEach((act) => {
      activitesContainer.innerHTML += `
        <div class="swiper-slide">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="${act.image}" class="w-full h-56 object-cover">
            <div class="p-4">
              <h3 class="text-xl font-bold text-green-700">${act.titre}</h3>
              <p class="text-gray-600">${act.desc}</p>
            </div>
          </div>
        </div>
      `;
    });

    // --- Actualités ---
    const actusList = document.getElementById("actus-list");
    data.actus.forEach((news) => {
      actusList.innerHTML += `
        <a href="actus.html?id=${news.id}" class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
          <img src="${news.image}" class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="text-xl font-bold text-green-700">${news.titre}</h3>
            <p class="text-green-500 text-sm">${news.desc}</p>
          </div>
        </a>
      `;
    });
    

    // --- Événements ---
    const eventsList = document.getElementById("events-list");
    data.evenements.forEach((evt) => {
      eventsList.innerHTML += `
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-bold text-green-700">${evt.titre}</h3>
          <p class="text-gray-600">${evt.desc}</p>
          <p class="mt-2"><span class="font-semibold">📅 ${evt.date}</span> | 📍 ${evt.lieu}</p>
        </div>
      `;
    });

    // --- Initialiser le carousel ---
    new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      autoplay: { delay: 3000 },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  });

// Menu Burger
const menuBtn = document.getElementById("menu-btn");
const menuMobile = document.getElementById("menu-mobile");

menuBtn.addEventListener("click", () => {
  menuMobile.classList.toggle("hidden");
});


// SCRIPT PARALLAX (place juste avant </body>)

  window.addEventListener('DOMContentLoaded', function () {
    const section = document.getElementById('hero');
    const bg = document.getElementById('parallax-bg');

    // chemins images (change si besoin)
    const mobileImg = 'src/images/fond-desktop2.jpeg';
    const desktopImg = 'src/images/fond-desktop2.jpeg';

    const speed = 0.25; // <--- ajuste la vitesse (0.1 = très lent, 0.5 = plus rapide)
    let ticking = false;

    // sélection de l'image selon la taille (mobile / desktop)
    function setBgImage() {
      const w = window.innerWidth;
      const chosen = (w < 768) ? mobileImg : desktopImg;
      // évite de réécrire si identique
      const current = bg.style.backgroundImage || '';
      if (!current.includes(chosen)) {
        bg.style.backgroundImage = `url("${chosen}")`;
      }
    }

    // animation parallax (optimisée avec requestAnimationFrame)
    function onScroll() {
      // respecte les utilisateurs qui demandent "reduced motion"
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = section.getBoundingClientRect();
          // y = déplacement proportionnel à la position de la section
          const y = -rect.top * speed;
          bg.style.transform = `translate3d(0, ${y}px, 0)`;
          ticking = false;
        });
        ticking = true;
      }
    }

    // initialisation
    setBgImage();
    // position initiale (si la page est déjà scrollée)
    onScroll();

    // listeners
    window.addEventListener('resize', setBgImage);
    window.addEventListener('scroll', onScroll, { passive: true });
  });

//   js contacts 

// ---------- Contact form ----------
(function () {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  const submitBtn = document.getElementById('contact-submit');

  function showMessage(type, msg) {
    status.classList.remove('hidden', 'bg-green-50', 'text-green-700', 'bg-red-50', 'text-red-700', 'border', 'border-green-100', 'border-red-100');
    if (type === 'success') {
      status.classList.add('bg-green-50', 'text-green-700', 'border', 'border-green-100');
    } else {
      status.classList.add('bg-red-50', 'text-red-700', 'border', 'border-red-100');
    }
    status.innerHTML = `<p class="p-3">${msg}</p>`;
    setTimeout(() => status.classList.add('hidden'), 7000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      showMessage('error', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Envoi...';

    try {
      // === OPTION 1 : Formspree (recommandé pour production) ===
      // Remplace par ton ID Formspree (format ex: "f/abcd...") si tu veux recevoir des e-mails.
      const FORMSPREE_ID = 'REPLACE_WITH_YOUR_FORM_ID';

      if (FORMSPREE_ID === 'REPLACE_WITH_YOUR_FORM_ID') {
        // Fallback localStorage (pour tests locaux sans Formspree)
        const saved = JSON.parse(localStorage.getItem('ades_messages') || '[]');
        saved.unshift({
          name,
          email,
          sujet: form.querySelector('[name="sujet"]').value || '',
          message,
          date: new Date().toISOString()
        });
        localStorage.setItem('ades_messages', JSON.stringify(saved));
        showMessage('success', 'Message enregistré localement. Remplacez FORMSPREE_ID pour envoyer par email.');
        form.reset();
      } else {
        // Envoi via Formspree
        const formData = new FormData(form);
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        const json = await res.json();
        if (res.ok) {
          showMessage('success', 'Merci — votre message a bien été envoyé !');
          form.reset();
        } else {
          showMessage('error', 'Erreur lors de l’envoi : ' + (json.error || 'réessayez plus tard.'));
        }
      }
    } catch (err) {
      showMessage('error', 'Erreur : ' + err.message);
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
})();