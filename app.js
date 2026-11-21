(function () {
  const snap = document.getElementById("snap");
  const topbar = document.getElementById("topbar");

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(targetY, duration) {
    const start = snap.scrollTop;
    const distance = targetY - start;
    if (Math.abs(distance) < 2) return;
    const startTime = performance.now();
    const ms = duration || Math.min(1200, 500 + Math.abs(distance) * 0.35);

    function frame(now) {
      const t = Math.min(1, (now - startTime) / ms);
      snap.scrollTop = start + distance * easeInOutCubic(t);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function scrollToHash(hash) {
    const el = document.querySelector(hash);
    if (!el) return;
    smoothScrollTo(el.offsetTop, 900);
  }

  document.querySelectorAll("[data-scroll]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      scrollToHash(href);
      history.pushState(null, "", href);
    });
  });

  snap.addEventListener("scroll", () => {
    topbar.classList.toggle("is-solid", snap.scrollTop > 24);
  });

  const portes = {
    entreprendre: {
      title: "Entreprendre",
      meta: "Financement & transmission · International",
      html: `
        <h4>Financement, transmission &amp; prévention</h4>
        <p>Alerte précoce et CIP, bourse confidentielle de la reprise dès 57 ans, aide aux marchés publics locaux et groupements d’entreprises face aux grands appels d’offres.</p>
        <h4>International &amp; transfrontalier</h4>
        <p>Desk franco-luxembourgeois, V.I.E partagés entre PME, missions export clés en main vers le Benelux, la Méditerranée et l’Afrique francophone.</p>
      `,
    },
    territoire: {
      title: "Territoire",
      meta: "Foncier · Commerce & ruralité · Agro",
      html: `
        <h4>Aménagement &amp; foncier</h4>
        <p>Observatoire des friches et parcelles réellement exploitables, avis offensifs sur les PLUi, densification des ZAE, pépinières et sites clés en main.</p>
        <h4>Commerce indépendant &amp; ruralité</h4>
        <p>Charte travaux &amp; commerce, bourse des locaux vacants, modernisation numérique des indépendants, sauvetage du dernier commerce rural.</p>
        <h4>Agroalimentaire</h4>
        <p>Contrats de filière ferme–usine, réponse groupée à la restauration collective, pépinière au Marché d’intérêt local, transition emballages.</p>
      `,
    },
    industrie: {
      title: "Industrie",
      meta: "Industrie & énergie · Infrastructures · Innovation / IA / cyber",
      html: `
        <h4>Industrie du futur &amp; énergie</h4>
        <p>Groupements d’achat et PPA, diagnostics énergétiques, écologie industrielle sur les zones, modernisation et électrification des procédés.</p>
        <h4>Infrastructures &amp; logistique</h4>
        <p>Pilotage SE3M et Grand Nancy Aéropôle, report modal fluvial/ferroviaire, accessibilité du territoire.</p>
        <h4>Innovation, IA &amp; cybersécurité</h4>
        <p>Diagnostics IA pour PME, bouclier cyber consulaire, pont labos–entreprises, propriété intellectuelle.</p>
      `,
    },
    filiere: {
      title: "Filière",
      meta: "Formation · Santé · École de Nancy · Transformation écologique et sociale",
      html: `
        <h4>Formation &amp; métiers</h4>
        <p>Carte des formations pilotée par les besoins, promotions sur-mesure, rétention des diplômés, lien jeunesse économique.</p>
        <h4>Santé &amp; silver</h4>
        <p>Cluster autour de Brabois, accès des PME aux marchés hospitaliers, filière autonomie en ruralité.</p>
        <h4>ICC &amp; marque École de Nancy</h4>
        <p>Marque collective, comptoir d’export mutualisé, showroom B2B rue Stanislas pour artisans d’art et créateurs.</p>
        <h4>Transformation écologique et sociale</h4>
        <p>Accompagnement CSRD pragmatique, entrepreneuriat au féminin, numérique responsable, biodiversité en zones d’activité.</p>
      `,
    },
  };

  const drawer = document.getElementById("drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerMeta = document.getElementById("drawer-meta");
  const drawerBody = document.getElementById("drawer-body");

  function openDrawer(key) {
    const data = portes[key];
    if (!data) return;
    drawerTitle.textContent = data.title;
    drawerMeta.textContent = data.meta;
    drawerBody.innerHTML = data.html;
    drawer.classList.add("is-open");
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("is-open"));
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-drawer-open");
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-drawer-open");
    setTimeout(() => {
      backdrop.hidden = true;
    }, 300);
  }

  document.querySelectorAll(".porte-open").forEach((btn) => {
    btn.addEventListener("click", () => openDrawer(btn.dataset.porte));
  });

  document.getElementById("drawer-close")?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // Infographie Agora : pan + zoom
  const wrap = document.getElementById("map-wrap");
  const map = document.getElementById("agora-map");
  if (wrap && map) {
    let scale = 0.7;
    let x = -20;
    let y = -20;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    function apply() {
      map.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }
    apply();

    function zoomBy(delta, cx, cy) {
      const prev = scale;
      scale = Math.min(1.7, Math.max(0.42, scale + delta));
      const rect = wrap.getBoundingClientRect();
      const px = (cx ?? rect.width / 2);
      const py = (cy ?? rect.height / 2);
      const localX = px - rect.left;
      const localY = py - rect.top;
      x = localX - ((localX - x) * scale) / prev;
      y = localY - ((localY - y) * scale) / prev;
      apply();
    }

    wrap.addEventListener("wheel", (e) => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? 0.08 : -0.08, e.clientX, e.clientY);
    }, { passive: false });

    wrap.addEventListener("pointerdown", (e) => {
      dragging = true;
      wrap.classList.add("is-dragging");
      lastX = e.clientX;
      lastY = e.clientY;
      wrap.setPointerCapture(e.pointerId);
    });

    wrap.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      x += e.clientX - lastX;
      y += e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      apply();
    });

    wrap.addEventListener("pointerup", () => {
      dragging = false;
      wrap.classList.remove("is-dragging");
    });

    document.getElementById("zoom-in")?.addEventListener("click", () => zoomBy(0.12));
    document.getElementById("zoom-out")?.addEventListener("click", () => zoomBy(-0.12));
  }

  document.getElementById("idea-form")?.addEventListener("submit", (e) => {
    const form = e.target;
    if (!form.hasAttribute("netlify")) return;
    // Laisse Netlify gérer le POST en prod ; en local file:// on bloque juste le bruit.
    if (location.protocol === "file:") {
      e.preventDefault();
      alert("Formulaire branché Netlify une fois le site en ligne.");
    }
  });
})();
