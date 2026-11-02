
(function () {
    "use strict";

    const root = document.documentElement;
    const themeButton = document.getElementById("theme");

    // Theme

    function isDark() {
        const selected = root.getAttribute("data-theme");

        if (selected) {
            return selected === "dark";
        }

        return window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
    }

    function updateThemeLabel() {
        if (themeButton) {
            themeButton.textContent = isDark() ? "Light" : "Dark";
        }
    }

    try {
        const saved = localStorage.getItem("theme");

        if (saved === "light" || saved === "dark") {
            root.setAttribute("data-theme", saved);
        }
    } catch (error) {
        // Storage may be unavailable.
    }

    if (themeButton) {
        themeButton.addEventListener("click", function () {
            const next = isDark() ? "light" : "dark";

            root.setAttribute("data-theme", next);

            try {
                localStorage.setItem("theme", next);
            } catch (error) {
                // Continue without storing preference.
            }

            updateThemeLabel();
        });

        updateThemeLabel();
    }

    // News - only runs on news.html

    const newsList = document.getElementById("news-list");
    const newsStatus = document.getElementById("news-status");

    if (newsList && newsStatus) {
        fetch(
            "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=12"
        )
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("News service unavailable");
                }

                return response.json();
            })
            .then(function (data) {
                newsList.replaceChildren();

                const articles = Array.isArray(data.hits)
                    ? data.hits
                    : [];

                if (articles.length === 0) {
                    newsStatus.textContent =
                        "No stories available right now.";
                    return;
                }

                newsStatus.textContent =
                    "Top stories from Hacker News.";

                articles.forEach(function (article) {
                    const link = document.createElement("a");

                    link.className = "item";
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";

                    link.href = article.url ||
                        "https://news.ycombinator.com/item?id=" +
                        encodeURIComponent(article.objectID);

                    const title = document.createElement("h3");
                    title.textContent =
                        article.title || "Untitled story";

                    const meta = document.createElement("p");
                    meta.className = "meta";

                    const points = article.points ?? 0;
                    const date = article.created_at
                        ? new Date(article.created_at).toLocaleDateString()
                        : "";

                    meta.textContent =
                        points + " points · " + date;

                    link.appendChild(title);
                    link.appendChild(meta);

                    newsList.appendChild(link);
                });
            })
            .catch(function () {
                newsStatus.textContent =
                    "Couldn't load the news. Please refresh or try again later.";
            });
    }

    // Contact form - only runs on index.html

    const form = document.getElementById("contact-form");
    const note = document.getElementById("form-note");
    const send = document.getElementById("f-send");

    const EMAIL = "angelplisiotis@gmail.com";

    // Add your existing Web3Forms access key here.
    const ACCESS_KEY = "";

    if (form && note && send) {
        if (!ACCESS_KEY) {
            note.textContent =
                "Submitting will open your email application.";
        }

        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const bot = document.getElementById("f-bot");

            if (bot && bot.checked) {
                return;
            }

            const name = document
                .getElementById("f-name").value.trim();

            const email = document
                .getElementById("f-email").value.trim();

            const message = document
                .getElementById("f-msg").value.trim();

            if (!name || !email || !message) {
                return;
            }

            if (!ACCESS_KEY) {
                const subject = "Message from " + name;

                const body =
                    message + "\n\n" +
                    name + " (" + email + ")";

                window.location.href =
                    "mailto:" + EMAIL +
                    "?subject=" + encodeURIComponent(subject) +
                    "&body=" + encodeURIComponent(body);

                return;
            }

            send.disabled = true;
            send.textContent = "Sending…";

            try {
                const response = await fetch(
                    "https://api.web3forms.com/submit",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({
                            access_key: ACCESS_KEY,
                            subject:
                                "New message from " + name +
                                " via your portfolio",
                            name: name,
                            email: email,
                            message: message
                        })
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error("Message not sent");
                }

                form.reset();

                note.textContent =
                    "Thank you, your message has been sent.";
            } catch (error) {
                note.textContent =
                    "Message not sent. Please email " +
                    EMAIL + " directly.";
            } finally {
                send.disabled = false;
                send.textContent = "Send message";
            }
        });
    }
})();
