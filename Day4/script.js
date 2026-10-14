//javascript
// 1. Select the HTML elements
const textarea = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

// 2. Storage keys
const DRAFT_KEY = "quicknotes-draft";
const THEME_KEY = "quicknotes-theme";

// 3. Update the character and word counters
function updateCounts() {
    const text = textarea.value;
    const characters = text.length;
    const words = text.trim() === ""
        ? 0
        : text.trim().split(/\s+/).length;

    charCount.textContent = `${characters} / 200 characters`;
    wordCount.textContent = `${words} ${words === 1 ? "word" : "words"}`;

    charCount.classList.toggle("warning", characters > 180);
    charCount.classList.toggle("over", characters > 200);
}

// 4. Save the draft whenever the user types
textarea.addEventListener("input", () => {
    updateCounts();
    localStorage.setItem(DRAFT_KEY, textarea.value);
});

// 5. Clear the textarea, counters and saved draft
function clearNote() {
    textarea.value = "";
    localStorage.removeItem(DRAFT_KEY);
    updateCounts();
    textarea.focus();
}

// Clear button
clearBtn.addEventListener("click", clearNote);

// Clear when Escape is pressed inside the textarea
textarea.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        clearNote();
    }
});

// 6. Toggle and save the theme
function updateThemeButton() {
    themeToggle.textContent = document.body.classList.contains("dark")
        ? "Light mode"
        : "Dark mode";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem(THEME_KEY, theme);
    updateThemeButton();
});

// 7. Restore saved draft and theme when the page loads
const savedDraft = localStorage.getItem(DRAFT_KEY);

if (savedDraft !== null) {
    textarea.value = savedDraft;
}

const savedTheme = localStorage.getItem(THEME_KEY);

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

updateThemeButton();
updateCounts();
