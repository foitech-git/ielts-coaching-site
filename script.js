const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");
const header = document.querySelector("[data-header]");

const escapeHTML = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const asLines = (value) => (Array.isArray(value) ? value : String(value || "").split("\n")).filter(Boolean);
const paragraphHTML = (value) =>
  String(value || "")
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
    .join("");

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
});

function renderHome() {
  const data = window.BandBridge?.getData();
  if (!data || !document.querySelector("[data-home-page]")) return;

  const heroMedia = document.querySelector("[data-hero-media]");
  if (heroMedia && data.hero?.backgroundImage) {
    heroMedia.style.backgroundImage = `url("${data.hero.backgroundImage}")`;
  }

  const stats = document.querySelector("[data-hero-stats]");
  if (stats) {
    stats.innerHTML = (data.hero?.stats || [])
      .map((item) => `<div><dt>${escapeHTML(item.value)}</dt><dd>${escapeHTML(item.label)}</dd></div>`)
      .join("");
  }

  renderTrust(data.trust || []);
  renderCourses(data.courses || []);
  renderMethod(data.method || []);
  renderSchedule(data.schedule || []);
  renderResults(data.resultMetrics || [], data.feedback || []);
  renderAchievers(data.achievers || []);
  renderBlogPreview(data.blogs || []);
  renderFaqs(data.faqs || []);
}

function renderImage(key, data) {
  document.querySelectorAll(`[data-section-image="${key}"]`).forEach((image) => {
    const src = data.sectionImages?.[key];
    if (src) image.setAttribute("src", src);
  });
}

function renderTrust(items) {
  const target = document.querySelector("[data-trust-list]");
  if (!target) return;
  target.innerHTML = items
    .map(
      (item) => `
        <div class="trust-item">
          <span>${escapeHTML(item.number)}</span>
          <strong>${escapeHTML(item.title)}</strong>
          <p>${escapeHTML(item.copy)}</p>
        </div>
      `
    )
    .join("");
}

function renderCourses(courses) {
  const tabs = document.querySelector("[data-course-tabs]");
  const grid = document.querySelector("[data-course-grid]");
  if (!tabs || !grid) return;

  let selected = courses[0]?.id;
  const draw = () => {
    tabs.innerHTML = courses
      .map(
        (course) => `
          <button class="goal-button ${course.id === selected ? "is-active" : ""}" type="button" role="tab"
            aria-selected="${course.id === selected}" data-course-select="${escapeHTML(course.id)}">
            ${escapeHTML(course.tab || course.tag)}
          </button>
        `
      )
      .join("");

    grid.innerHTML = courses
      .map(
        (course) => `
          <article class="course-card ${course.id === selected ? "is-featured" : ""}">
            <span class="tag">${escapeHTML(course.tag)}</span>
            <h3>${escapeHTML(course.title)}</h3>
            <p>${escapeHTML(course.copy)}</p>
            <ul>${asLines(course.points).map((point) => `<li>${escapeHTML(point)}</li>`).join("")}</ul>
            <a href="#contact">Ask for this course</a>
          </article>
        `
      )
      .join("");
  };

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-course-select]");
    if (!button) return;
    selected = button.getAttribute("data-course-select");
    draw();
  });

  draw();
}

function renderMethod(items) {
  const target = document.querySelector("[data-method-list]");
  if (!target) return;
  target.innerHTML = items
    .map(
      (item) => `
        <article>
          <span>${escapeHTML(item.number)}</span>
          <div>
            <h3>${escapeHTML(item.title)}</h3>
            <p>${escapeHTML(item.copy)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderSchedule(items) {
  const target = document.querySelector("[data-schedule-list]");
  if (!target) return;
  target.innerHTML = items
    .map(
      (item) => `
        <article>
          <strong>${escapeHTML(item.title)}</strong>
          <span>${escapeHTML(item.time)}</span>
          <p>${escapeHTML(item.copy)}</p>
        </article>
      `
    )
    .join("");
}

function renderResults(metrics, feedback) {
  const metricTarget = document.querySelector("[data-result-metrics]");
  const feedbackTarget = document.querySelector("[data-feedback-list]");

  if (metricTarget) {
    metricTarget.innerHTML = metrics
      .map((item) => `<div><strong>${escapeHTML(item.value)}</strong><span>${escapeHTML(item.label)}</span></div>`)
      .join("");
  }

  if (feedbackTarget) {
    feedbackTarget.innerHTML = feedback
      .map(
        (item) => `
          <blockquote>
            <p>"${escapeHTML(item.quote)}"</p>
            <cite>${escapeHTML(item.name)}, ${escapeHTML(item.type)}</cite>
          </blockquote>
        `
      )
      .join("");
  }
}

function renderAchievers(items) {
  const target = document.querySelector("[data-achiever-list]");
  if (!target) return;

  const tabsTarget = document.querySelector("[data-achiever-tabs]");
  const prevButton = document.querySelector("[data-achiever-prev]");
  const nextButton = document.querySelector("[data-achiever-next]");

  function hashString(value) {
    return String(value || "").split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);
  }

  function avatarDataUri(initials) {
    const safe = String(initials || "").toUpperCase().slice(0, 3);
    const hue = hashString(safe) % 360;
    const bg = `hsl(${hue} 52% 45%)`;
    const fg = "white";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="18" fill="${bg}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" font-size="34" font-weight="800" fill="${fg}">${escapeHTML(
      safe
    )}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  const parsedScores = items
    .map((item) => Number.parseFloat(item.overall))
    .filter((value) => Number.isFinite(value));

  const uniqueScores = Array.from(new Set(parsedScores)).sort((a, b) => b - a);

  const tabs = [{ label: "All", minScore: null }, ...uniqueScores.map((score) => ({ label: `Band ${score}+`, minScore: score }))];
  let activeMinScore = null;

  function renderCards(cardItems) {
    target.innerHTML = cardItems
      .map((item) => {
        const avatarSource = item.photo ? item.photo : avatarDataUri(item.initials);
        const avatar = `<span class="student-avatar" aria-hidden="true"><img src="${escapeHTML(
          avatarSource
        )}" alt="" loading="lazy" /></span>`;

        return `
          <article class="score-card">
            ${avatar}
            <div>
              <h3>${escapeHTML(item.name)}</h3>
              <p>${escapeHTML(item.track)}</p>
            </div>
            <strong>${escapeHTML(item.overall)}</strong>
            <dl>
              <div><dt>L</dt><dd>${escapeHTML(item.listening)}</dd></div>
              <div><dt>R</dt><dd>${escapeHTML(item.reading)}</dd></div>
              <div><dt>W</dt><dd>${escapeHTML(item.writing)}</dd></div>
              <div><dt>S</dt><dd>${escapeHTML(item.speaking)}</dd></div>
            </dl>
          </article>
        `;
      })
      .join("");
  }

  function filteredItems() {
    if (!Number.isFinite(activeMinScore)) return items;
    return items.filter((item) => Number.parseFloat(item.overall) >= activeMinScore);
  }

  function clampScroll(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function updateNavButtons() {
    if (!prevButton || !nextButton) return;
    const maxScroll = Math.max(0, target.scrollWidth - target.clientWidth);
    const current = clampScroll(target.scrollLeft, 0, maxScroll);
    prevButton.disabled = current <= 2;
    nextButton.disabled = current >= maxScroll - 2;
  }

  function scrollByPage(direction) {
    const amount = Math.max(260, target.clientWidth * 0.9) * direction;
    target.scrollBy({ left: amount, behavior: "smooth" });
  }

  function renderTabs() {
    if (!tabsTarget) return;
    tabsTarget.innerHTML = tabs
      .map((tab) => {
        const isActive = tab.minScore === activeMinScore;
        const dataValue = tab.minScore == null ? "" : String(tab.minScore);
        return `<button class="goal-button ${isActive ? "is-active" : ""}" type="button" role="tab" aria-selected="${isActive}" data-achiever-tab="${escapeHTML(
          dataValue
        )}">${escapeHTML(tab.label)}</button>`;
      })
      .join("");
  }

  function renderAll() {
    renderTabs();
    renderCards(filteredItems());
    target.scrollLeft = 0;
    updateNavButtons();
  }

  if (tabsTarget) {
    tabsTarget.addEventListener("click", (event) => {
      const button = event.target.closest("[data-achiever-tab]");
      if (!button) return;
      const value = button.dataset.achieverTab;
      activeMinScore = value ? Number.parseFloat(value) : null;
      renderAll();
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      scrollByPage(-1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      scrollByPage(1);
    });
  }

  target.addEventListener("scroll", () => {
    updateNavButtons();
  });

  window.addEventListener("resize", () => {
    updateNavButtons();
  });

  renderAll();
}

function renderBlogPreview(blogs) {
  const target = document.querySelector("[data-blog-preview]");
  if (!target) return;
  target.innerHTML = blogs
    .slice(0, 3)
    .map((post) => blogCard(post, { showImage: false }))
    .join("");
}

function renderBlogList() {
  const data = window.BandBridge?.getData();
  const target = document.querySelector("[data-blog-list]");
  if (!data || !target) return;
  target.innerHTML = (data.blogs || []).map((post) => blogCard(post, { showImage: true })).join("");
}

function blogCard(post, options = {}) {
  return `
    <article class="blog-card">
      ${options.showImage ? `<img src="${escapeHTML(post.image || "./assets/section-blog.png")}" alt="" />` : ""}
      <span class="tag">${escapeHTML(post.category)}</span>
      <h3>${escapeHTML(post.title)}</h3>
      <p>${escapeHTML(post.excerpt)}</p>
      <a href="./post.html?slug=${encodeURIComponent(post.slug)}">Read guide</a>
    </article>
  `;
}

function renderFaqs(items) {
  const target = document.querySelector("[data-faq-list]");
  if (!target) return;
  target.innerHTML = items
    .map(
      (item) => `
        <details>
          <summary>${escapeHTML(item.question)}</summary>
          <p>${escapeHTML(item.answer)}</p>
        </details>
      `
    )
    .join("");
}

function renderPost() {
  const data = window.BandBridge?.getData();
  const target = document.querySelector("[data-post-page]");
  if (!data || !target) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug") || data.blogs?.[0]?.slug;
  const post = (data.blogs || []).find((item) => item.slug === slug);

  if (!post) {
    target.innerHTML = `
      <section class="blog-hero compact-hero">
        <div>
          <p class="eyebrow">Blog post not found</p>
          <h1>This article is not available.</h1>
          <p>Return to the blog page and choose another IELTS guide.</p>
          <a class="button primary" href="./blog.html">Back to blog</a>
        </div>
      </section>
    `;
    document.title = "Article Not Found | BandBridge IELTS Academy";
    return;
  }

  document.title = `${post.title} | BandBridge IELTS Academy`;
  target.innerHTML = `
    <section class="post-hero" style="background-image: linear-gradient(90deg, rgba(251,254,253,.98), rgba(251,254,253,.72), rgba(251,254,253,.18)), url('${escapeHTML(post.image || "./assets/section-blog.png")}')">
      <div>
        <a class="back-link" href="./blog.html">Back to blog</a>
        <p class="eyebrow">${escapeHTML(post.category)}</p>
        <h1>${escapeHTML(post.title)}</h1>
        <p>${escapeHTML(post.excerpt)}</p>
      </div>
    </section>
    <article class="post-body">
      ${paragraphHTML(post.content)}
      ${
        asLines(post.bullets).length
          ? `<ul>${asLines(post.bullets).map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`
          : ""
      }
    </article>
    <section class="blog-cta">
      <div>
        <p class="eyebrow">Need a personal plan?</p>
        <h2>Book a free demo and get your module-wise roadmap.</h2>
      </div>
      <a class="button primary" href="./index.html#contact">Request call back</a>
    </section>
  `;
}

async function submitLead(form) {
  const formData = new FormData(form);
  const payload = {
    page: window.location.pathname,
    source: "website",
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    band: String(formData.get("band") || "").trim(),
    batch: String(formData.get("batch") || "").trim(),
    message: String(formData.get("message") || "").trim(),
  };

  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Lead submit failed");
  }
}

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!(form instanceof HTMLFormElement)) return;

    const status = form.querySelector("[data-form-status]");
    const formData = new FormData(form);
    const name = String(formData.get("name") || "there").trim();
    const message = form.getAttribute("data-form-message") || "Thanks, {name}. We will call you shortly.";

    if (status) status.textContent = "Sending...";

    try {
      await submitLead(form);
    } catch {
      if (status) status.textContent = message.replace("{name}", name);
      form.reset();
      return;
    }

    if (status) status.textContent = message.replace("{name}", name);
    form.reset();
  });
});

(window.BandBridge?.ready || Promise.resolve()).then(() => {
  renderHome();
  renderBlogList();
  renderPost();
});
