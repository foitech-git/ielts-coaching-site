(function () {
  const STORAGE_KEY = "bandbridge-site-data-v2";

  const defaultData = {
    hero: {
      backgroundImage: "./assets/ielts-classroom-hero.png",
      stats: [
        { value: "8.5", label: "highest band" },
        { value: "24", label: "mock tests" },
        { value: "4", label: "skill modules" },
      ],
    },
    sectionImages: {
      courses: "./assets/section-courses.png",
      method: "./assets/section-method.png",
      schedule: "./assets/section-schedule.png",
      achievers: "./assets/section-achievers.png",
      blog: "./assets/section-blog.png",
    },
    trust: [
      { number: "01", title: "Certified trainers", copy: "Live correction for writing and speaking, not generic notes." },
      { number: "02", title: "Flexible batches", copy: "Morning, evening, weekend, and online options." },
      { number: "03", title: "Personal band plan", copy: "Weekly targets based on your current level and deadline." },
    ],
    courses: [
      {
        id: "foundation",
        tab: "Band 5.5-6.0",
        tag: "Foundation Sprint",
        title: "6-week confidence builder",
        copy: "Strengthen grammar, essay structure, listening accuracy, and speaking fluency with guided practice.",
        points: ["4 live classes per week", "Grammar repair and vocabulary bank", "Weekly writing corrections"],
      },
      {
        id: "advanced",
        tab: "Band 6.5-7.0",
        tag: "Band Booster",
        title: "8-week score improvement plan",
        copy: "Tighten timing, improve answer quality, and remove the mistakes that keep your score stuck.",
        points: ["Full mock every Saturday", "Speaking and writing review", "Reading speed and listening trap drills"],
      },
      {
        id: "express",
        tab: "Band 7.5+",
        tag: "Express Mastery",
        title: "4-week high-band intensive",
        copy: "A concentrated plan for test-ready students who need precision, speed, and advanced feedback.",
        points: ["Daily timed practice", "Advanced essay and cue-card review", "Final-week exam simulation"],
      },
    ],
    method: [
      { number: "1", title: "Diagnostic band check", copy: "Start with a full module review and trainer notes for your weak areas." },
      { number: "2", title: "Module-wise coaching", copy: "Focused practice for listening traps, reading speed, essay clarity, and speaking fluency." },
      { number: "3", title: "Timed mock tests", copy: "Full-length tests with score analysis, correction notes, and next-week priorities." },
      { number: "4", title: "Exam booking support", copy: "Guidance for test dates, documents, speaking slot preparation, and final revision." },
    ],
    schedule: [
      { title: "Morning Batch", time: "Mon-Fri, 7:30 AM", copy: "Best for college students and early test takers." },
      { title: "Evening Batch", time: "Mon-Fri, 6:30 PM", copy: "Designed for working professionals." },
      { title: "Weekend Intensive", time: "Sat-Sun, 10:00 AM", copy: "Fast-track revision with full mocks." },
      { title: "Online Live", time: "Daily flexible slots", copy: "Interactive classes with recordings and assignments." },
    ],
    resultMetrics: [
      { value: "92%", label: "students improved writing by at least 0.5 band" },
      { value: "18K+", label: "practice questions completed" },
      { value: "1:8", label: "trainer to student ratio" },
    ],
    feedback: [
      {
        quote:
          "The writing feedback was direct and practical. I stopped repeating the same structure mistakes and moved from 6.0 to 7.0.",
        name: "Riya S.",
        type: "Academic IELTS",
      },
      {
        quote:
          "Speaking mock recordings helped me understand where I sounded memorized. My final speaking score was 7.5.",
        name: "Aman K.",
        type: "General Training",
      },
    ],
    achievers: [
      { initials: "PM", name: "Pranav Mehta", track: "Academic IELTS", overall: "8.5", listening: "8.5", reading: "9.0", writing: "7.5", speaking: "8.0" },
      { initials: "MK", name: "Mehak Kaur", track: "General Training", overall: "8.0", listening: "8.5", reading: "8.0", writing: "7.0", speaking: "8.0" },
      { initials: "AS", name: "Arjun Singh", track: "Academic IELTS", overall: "7.5", listening: "8.0", reading: "8.0", writing: "7.0", speaking: "7.5" },
      { initials: "SR", name: "Simran Rao", track: "Study visa track", overall: "8.0", listening: "8.0", reading: "8.5", writing: "7.5", speaking: "8.0" },
    ],
    blogs: [
      {
        id: "essay-plan",
        slug: "essay-plan",
        category: "Writing",
        title: "How to plan Task 2 essays in 7 minutes",
        excerpt: "Use a fast structure that keeps your opinion clear and your examples relevant.",
        image: "./assets/section-blog.png",
        content:
          "A strong IELTS essay usually starts before you write the introduction. Spend two minutes understanding the question type, two minutes choosing your position, and three minutes noting two clear reasons with one example each.\n\nUse this order: position, reason one, example one, reason two, example two, final opinion. This keeps your response focused and helps you avoid weak paragraphs that only repeat the question.",
        bullets: ["Underline the task words before planning.", "Write one clear opinion, not a half-answer.", "Use examples you can explain in two sentences."],
      },
      {
        id: "reading-speed",
        slug: "reading-speed",
        category: "Reading",
        title: "Skimming vs scanning in IELTS Reading",
        excerpt: "Learn when to read broadly, when to hunt for keywords, and how to protect your time.",
        image: "./assets/section-courses.png",
        content:
          "Skimming helps you understand the topic and paragraph direction. Scanning helps you locate a date, name, number, or keyword. Use both, but do not read every sentence slowly at the start.\n\nFor headings, skim paragraph purpose. For True, False, Not Given, scan for the exact idea and compare the meaning carefully.",
        bullets: ["Skim paragraph purpose first.", "Scan only after you know what detail you need.", "Do not spend too long on one difficult question."],
      },
      {
        id: "speaking-natural",
        slug: "speaking-natural",
        category: "Speaking",
        title: "How to sound natural in IELTS Speaking Part 2",
        excerpt: "Build answers with stories, details, and linking phrases without memorizing scripts.",
        image: "./assets/section-method.png",
        content:
          "Examiners do not need memorized speeches. They need clear, natural language. Use the cue card points as a path: introduce the topic, give context, describe one real detail, and explain why it matters.\n\nRecord yourself for two minutes and listen for pauses, repeated words, and unclear endings. Then repeat with one better linking phrase and one stronger example.",
        bullets: ["Use a real memory or believable example.", "Add one feeling and one reason.", "Finish with a clear final sentence."],
      },
      {
        id: "listening-traps",
        slug: "listening-traps",
        category: "Listening",
        title: "Common listening traps that reduce your band",
        excerpt: "Avoid corrections, distractors, spelling changes, and plural-form mistakes.",
        image: "./assets/section-schedule.png",
        content:
          "Many wrong answers happen because students write the first word they hear. IELTS often uses corrections, distractors, spelling changes, and plural forms. Keep listening until the speaker confirms the final answer.\n\nBefore each recording starts, scan the questions and predict the type of answer: number, noun, address, date, or name. This makes the audio easier to follow.",
        bullets: ["Wait for corrections before writing final answers.", "Check singular and plural forms.", "Transfer answers carefully at the end."],
      },
      {
        id: "30-day-routine",
        slug: "30-day-routine",
        category: "Study plan",
        title: "A 30-day IELTS routine for busy students",
        excerpt: "Use short daily blocks and weekly mock reviews to improve steadily.",
        image: "./assets/section-achievers.png",
        content:
          "Use short daily blocks: 25 minutes vocabulary, 35 minutes one module, and 15 minutes error review. On weekends, complete one full mock and rewrite one essay after feedback.\n\nThe key is not only practice volume. You need to review the mistake pattern after every test so the next session has a clear purpose.",
        bullets: ["Practice one module per day.", "Keep one error notebook.", "Do a full mock every weekend."],
      },
    ],
    faqs: [
      { question: "Do you teach both Academic and General Training?", answer: "Yes. We separate writing and reading practice by test type while keeping listening and speaking aligned." },
      { question: "Can I join if my English level is basic?", answer: "Yes. The foundation track starts with grammar repair, sentence building, and guided speaking practice." },
      { question: "Do you provide writing correction?", answer: "Every plan includes trainer correction with notes against IELTS band descriptors." },
    ],
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : clone(defaultData);
    } catch {
      return clone(defaultData);
    }
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function resetData() {
    localStorage.removeItem(STORAGE_KEY);
    return clone(defaultData);
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `post-${Date.now()}`;
  }

  function uid(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
  }

  window.BandBridge = {
    STORAGE_KEY,
    defaultData,
    getData,
    saveData,
    resetData,
    clone,
    slugify,
    uid,
  };
})();
