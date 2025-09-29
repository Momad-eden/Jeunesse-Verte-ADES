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
          <p class="mt-2"><span class="font-semibold"> ${evt.date}</span> |  ${evt.lieu}</p>
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

// Fermer le menu quand on défile
window.addEventListener("scroll", () => {
  if (!menuMobile.classList.contains("hidden")) {
    menuMobile.classList.add("hidden");
  }
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
(function () {
  const form = document.getElementById('adhesion-form');
  const status = document.getElementById('adhesion-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  function showMessage(type, msg) {
    status.className = "rounded-md mt-2 text-sm p-3";
    if (type === 'success') {
      status.classList.add("bg-green-50", "text-green-700", "border", "border-green-100");
    } else {
      status.classList.add("bg-red-50", "text-red-700", "border", "border-red-100");
    }
    status.innerText = msg;
    status.classList.remove("hidden");
    setTimeout(() => status.classList.add("hidden"), 7000);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Envoi...";

    try {
      const FORMSPREE_ID = "xdkwkyby"; 
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (res.ok) {
        showMessage("success", "Merci — votre adhésion a bien été envoyée !");
        form.reset();
      } else {
        showMessage("error", "Erreur lors de l’envoi, vérifiez votre identifiant Formspree.");
      }
    } catch (err) {
      showMessage("error", "Erreur : " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
})();


