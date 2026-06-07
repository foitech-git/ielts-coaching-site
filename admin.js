const adminTabs = document.querySelector("[data-admin-tabs]");
const adminPanel = document.querySelector("[data-admin-panel]");
const adminStatus = document.querySelector("[data-admin-status]");
const importBox = document.querySelector("[data-import-box]");
const importText = document.querySelector("[data-import-text]");

let draft = window.BandBridge.getData();
let activeSection = "hero";

const fieldConfigs = {
  hero: {
    label: "Hero & Images",
    description: "Control the hero background image and the image used in each home-page visual section.",
    fields: [
      { label: "Hero background image", path: "hero.backgroundImage", type: "image" },
      { label: "Choose your track image", path: "sectionImages.courses", type: "image" },
      { label: "Our method image", path: "sectionImages.method", type: "image" },
      { label: "Batch schedule image", path: "sectionImages.schedule", type: "image" },
      { label: "High-band achievers image", path: "sectionImages.achievers", type: "image" },
      { label: "Blogs image", path: "sectionImages.blog", type: "image" },
    ],
  },
  courses: {
    label: "Choose Your Track",
    description: "Add, delete, or change IELTS course tracks shown in the Choose your track section.",
    collection: "courses",
    addItem: () => ({
      id: window.BandBridge.uid("course"),
      tab: "Band 7.0",
      tag: "New Track",
      title: "New IELTS course",
      copy: "Describe this course track.",
      points: ["Live classes", "Mock tests", "Trainer feedback"],
    }),
    fields: [
      { label: "Tab label", key: "tab" },
      { label: "Tag", key: "tag" },
      { label: "Title", key: "title" },
      { label: "Description", key: "copy", type: "textarea" },
      { label: "Bullet points", key: "points", type: "lines" },
    ],
  },
  schedule: {
    label: "Batch Schedule",
    description: "Manage morning, evening, weekend, online, or custom batches.",
    collection: "schedule",
    addItem: () => ({ title: "New Batch", time: "Mon-Fri, 5:00 PM", copy: "Describe who this batch is for." }),
    fields: [
      { label: "Batch title", key: "title" },
      { label: "Time", key: "time" },
      { label: "Description", key: "copy", type: "textarea" },
    ],
  },
  results: {
    label: "Student Results",
    description: "Edit the headline metrics in the results panel.",
    collection: "resultMetrics",
    addItem: () => ({ value: "95%", label: "students improved their mock score" }),
    fields: [
      { label: "Metric value", key: "value" },
      { label: "Metric label", key: "label", type: "textarea" },
    ],
  },
  feedback: {
    label: "Feedback",
    description: "Manage student testimonials shown below the result metrics.",
    collection: "feedback",
    addItem: () => ({ quote: "The coaching helped me understand exactly what to improve.", name: "Student Name", type: "Academic IELTS" }),
    fields: [
      { label: "Quote", key: "quote", type: "textarea" },
      { label: "Student name", key: "name" },
      { label: "IELTS type", key: "type" },
    ],
  },
  achievers: {
    label: "High-Band Achievers",
    description: "Add successful students and their module-wise IELTS scores.",
    collection: "achievers",
    addItem: () => ({
      initials: "NS",
      name: "New Student",
      track: "Academic IELTS",
      photo: "",
      overall: "7.5",
      listening: "8.0",
      reading: "7.5",
      writing: "7.0",
      speaking: "7.5",
    }),
    fields: [
      { label: "Initials", key: "initials" },
      { label: "Name", key: "name" },
      { label: "Track", key: "track" },
      { label: "Photo URL", key: "photo", type: "imageText" },
      { label: "Overall", key: "overall" },
      { label: "Listening", key: "listening" },
      { label: "Reading", key: "reading" },
      { label: "Writing", key: "writing" },
      { label: "Speaking", key: "speaking" },
    ],
  },
  blogs: {
    label: "Blogs",
    description: "Manage blog cards and dedicated article pages. Each slug becomes post.html?slug=your-slug.",
    collection: "blogs",
    addItem: () => {
      const title = "New IELTS article";
      return {
        id: window.BandBridge.uid("blog"),
        slug: window.BandBridge.slugify(title),
        category: "IELTS Tips",
        title,
        excerpt: "Short summary for the blog card.",
        image: "./assets/section-blog.png",
        content: "Write the first paragraph here.\n\nWrite the second paragraph here.",
        bullets: ["First practical tip", "Second practical tip"],
      };
    },
    fields: [
      { label: "Category", key: "category" },
      { label: "Title", key: "title" },
      { label: "Slug", key: "slug" },
      { label: "Card image URL", key: "image", type: "imageText" },
      { label: "Excerpt", key: "excerpt", type: "textarea" },
      { label: "Article content", key: "content", type: "textarea" },
      { label: "Bullet tips", key: "bullets", type: "lines" },
    ],
  },
  questions: {
    label: "Questions",
    description: "Manage the FAQ questions shown near the bottom of the home page.",
    collection: "faqs",
    addItem: () => ({ question: "New question?", answer: "Write the answer here." }),
    fields: [
      { label: "Question", key: "question", type: "textarea" },
      { label: "Answer", key: "answer", type: "textarea" },
    ],
  },
};

function escapeAdmin(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getPath(path) {
  return path.split(".").reduce((value, part) => value?.[part], draft);
}

function setPath(path, value) {
  const parts = path.split(".");
  const key = parts.pop();
  const parent = parts.reduce((current, part) => current[part], draft);
  parent[key] = value;
}

function showStatus(message, isError = false) {
  if (!adminStatus) return;
  adminStatus.textContent = message;
  adminStatus.classList.toggle("is-error", isError);
}

function renderTabs() {
  adminTabs.innerHTML = Object.entries(fieldConfigs)
    .map(
      ([key, config]) => `
        <button class="${key === activeSection ? "is-active" : ""}" type="button" data-tab="${key}">
          ${escapeAdmin(config.label)}
        </button>
      `
    )
    .join("");
}

function renderAdminPanel() {
  const config = fieldConfigs[activeSection];
  renderTabs();

  if (!config.collection) {
    adminPanel.innerHTML = `
      <div class="admin-panel-heading">
        <p class="eyebrow">${escapeAdmin(config.label)}</p>
        <h2>${escapeAdmin(config.description)}</h2>
      </div>
      <div class="admin-field-grid">
        ${config.fields.map((field) => renderPathField(field)).join("")}
      </div>
    `;
    return;
  }

  const items = draft[config.collection] || [];
  adminPanel.innerHTML = `
    <div class="admin-panel-heading">
      <p class="eyebrow">${escapeAdmin(config.label)}</p>
      <h2>${escapeAdmin(config.description)}</h2>
    </div>
    <button class="button secondary admin-add" type="button" data-add="${config.collection}">Add item</button>
    <div class="admin-list">
      ${items
        .map(
          (item, index) => `
            <article class="admin-card">
              <header>
                <strong>${escapeAdmin(item.title || item.name || item.question || item.value || `Item ${index + 1}`)}</strong>
                <button type="button" data-delete="${config.collection}" data-index="${index}">Delete</button>
              </header>
              <div class="admin-field-grid">
                ${config.fields.map((field) => renderCollectionField(config.collection, index, field)).join("")}
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderPathField(field) {
  const value = getPath(field.path) || "";
  return `
    <label class="admin-field ${field.type === "image" ? "admin-image-field" : ""}">
      ${escapeAdmin(field.label)}
      <input type="text" value="${escapeAdmin(value)}" data-path="${field.path}" />
      ${
        field.type === "image"
          ? `<input type="file" accept="image/*" data-upload-path="${field.path}" />
             <img src="${escapeAdmin(value)}" alt="" />`
          : ""
      }
    </label>
  `;
}

function renderCollectionField(collection, index, field) {
  const value = draft[collection]?.[index]?.[field.key] ?? "";
  const common = `data-collection="${collection}" data-index="${index}" data-field="${field.key}" data-type="${field.type || "text"}"`;
  const displayValue = Array.isArray(value) ? value.join("\n") : value;

  if (field.type === "textarea" || field.type === "lines") {
    return `
      <label class="admin-field">
        ${escapeAdmin(field.label)}
        <textarea rows="${field.type === "lines" ? 4 : 5}" ${common}>${escapeAdmin(displayValue)}</textarea>
      </label>
    `;
  }

  return `
    <label class="admin-field ${field.type === "imageText" ? "admin-image-field" : ""}">
      ${escapeAdmin(field.label)}
      <input type="text" value="${escapeAdmin(displayValue)}" ${common} />
      ${field.type === "imageText" ? `<img src="${escapeAdmin(displayValue)}" alt="" />` : ""}
    </label>
  `;
}

function updateDraftFromInput(input) {
  const value = input.dataset.type === "lines" ? input.value.split("\n").filter(Boolean) : input.value;

  if (input.dataset.path) {
    setPath(input.dataset.path, value);
    return;
  }

  const { collection, index, field } = input.dataset;
  if (collection && field) {
    draft[collection][Number(index)][field] = field === "slug" ? window.BandBridge.slugify(value) : value;
  }
}

function handleFileUpload(input) {
  const file = input.files?.[0];
  const path = input.dataset.uploadPath;
  if (!file || !path) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    setPath(path, reader.result);
    renderAdminPanel();
    showStatus("Image loaded. Save changes to publish it.");
  });
  reader.readAsDataURL(file);
}

adminTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tab]");
  if (!button) return;
  activeSection = button.dataset.tab;
  renderAdminPanel();
});

adminPanel?.addEventListener("input", (event) => {
  const input = event.target;
  if (input.matches("input[data-path], textarea[data-path], input[data-collection], textarea[data-collection]")) {
    updateDraftFromInput(input);
  }
});

adminPanel?.addEventListener("change", (event) => {
  const input = event.target;
  if (input.matches("input[type='file'][data-upload-path]")) {
    handleFileUpload(input);
  }
});

adminPanel?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete]");
  const addButton = event.target.closest("[data-add]");

  if (deleteButton) {
    draft[deleteButton.dataset.delete].splice(Number(deleteButton.dataset.index), 1);
    renderAdminPanel();
    showStatus("Item deleted. Save changes to publish.");
  }

  if (addButton) {
    const config = Object.values(fieldConfigs).find((item) => item.collection === addButton.dataset.add);
    draft[addButton.dataset.add].push(config.addItem());
    renderAdminPanel();
    showStatus("New item added. Save changes to publish.");
  }
});

document.querySelector("[data-save-admin]")?.addEventListener("click", () => {
  try {
    window.BandBridge.saveData(draft);
    showStatus("Saved. Refresh the home or blog page to see the latest content.");
  } catch (error) {
    showStatus("Could not save. The uploaded image may be too large for browser storage.", true);
  }
});

document.querySelector("[data-reset-admin]")?.addEventListener("click", () => {
  if (!window.confirm("Reset all admin content back to the default website content?")) return;
  draft = window.BandBridge.resetData();
  renderAdminPanel();
  showStatus("Defaults restored.");
});

document.querySelector("[data-export-admin]")?.addEventListener("click", async () => {
  const json = JSON.stringify(draft, null, 2);
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(json);
      showStatus("JSON copied to clipboard.");
      return;
    } catch {
      // Fall through to import box display.
    }
  }
  importBox.hidden = false;
  importText.value = json;
  showStatus("Copy the JSON from the box below.");
});

document.querySelector("[data-import-admin]")?.addEventListener("click", () => {
  importBox.hidden = false;
  importText.value = "";
  showStatus("Paste exported JSON, then apply import.");
});

document.querySelector("[data-cancel-import]")?.addEventListener("click", () => {
  importBox.hidden = true;
});

document.querySelector("[data-apply-import]")?.addEventListener("click", () => {
  try {
    draft = JSON.parse(importText.value);
    window.BandBridge.saveData(draft);
    importBox.hidden = true;
    renderAdminPanel();
    showStatus("Imported and saved.");
  } catch {
    showStatus("Import failed. Check that the JSON is valid.", true);
  }
});

renderAdminPanel();
