document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chat-form");
    const userInput = document.getElementById("user-input");
    const chatMessages = document.getElementById("chat-messages");
    const typingIndicator = document.getElementById("typing-indicator");
    const clearChatBtn = document.getElementById("clear-chat");

    // Initialize with a welcome screen
    showWelcomeScreen();

    // Event listener for message submission
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const messageText = userInput.value.trim();
        if (!messageText) return;

        // Clear input field
        userInput.value = "";
        userInput.focus();

        // Remove welcome banner if it is the first message
        const welcomeBanner = document.querySelector(".welcome-banner");
        if (welcomeBanner) {
            welcomeBanner.remove();
        }

            appendMessage("user", messageText);

        showTypingIndicator();

        try {
            const response = await fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch bot response");
            }

            const data = await response.json();

            setTimeout(() => {
                hideTypingIndicator();
                appendMessage("bot", data.response, data.sources);
            }, 550);

        } catch (error) {
            console.error("Error communicating with chatbot API:", error);
            setTimeout(() => {
                hideTypingIndicator();
                appendMessage("bot", "Oops! I ran into an error connecting to the server. Please check the server logs and try again later.", null, true);
            }, 500);
        }
    });

    // Clear chat handler
    clearChatBtn.addEventListener("click", () => {
        chatMessages.innerHTML = "";
        hideTypingIndicator();
        showWelcomeScreen();
    });

    // Function to append a message to the chat container
    function appendMessage(sender, text, sources = null, isError = false) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        if (isError) {
            messageDiv.classList.add("message-error");
        }

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("message-content");
        contentDiv.innerText = text;

        const metaRow = document.createElement("div");
        metaRow.classList.add("message-meta", "message-meta-row");

        const timeSpan = document.createElement("span");
        timeSpan.classList.add("message-meta");
        timeSpan.innerText = formatTime(new Date());
        metaRow.appendChild(timeSpan);

        if (sender === "bot" && Array.isArray(sources) && sources.length > 0) {
            const badge = document.createElement("span");
            badge.classList.add("message-badge");
            badge.innerHTML = `<i class="fa-solid fa-link"></i> Evidence available`;
            metaRow.appendChild(badge);
        }

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(metaRow);

        if (sender === "bot" && Array.isArray(sources) && sources.length > 0) {
            const sourcesPanel = createSourcesPanel(sources);
            messageDiv.appendChild(sourcesPanel);
        }

        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function createSourcesPanel(sources) {
        const panel = document.createElement("div");
        panel.classList.add("sources-panel");

        const toggle = document.createElement("button");
        toggle.classList.add("sources-toggle");
        toggle.type = "button";
        toggle.innerHTML = `<span><i class="fa-solid fa-eye"></i> Show Evidence</span><i class="fa-solid fa-chevron-down"></i>`;

        const list = document.createElement("div");
        list.classList.add("source-list");

        sources.forEach((source) => {
            const item = document.createElement("div");
            item.classList.add("source-item");

            const title = document.createElement("a");
            title.href = source.url || source.link || "#";
            title.target = "_blank";
            title.rel = "noopener noreferrer";
            title.innerText = source.title || source.url || source.link || "Source";

            const description = document.createElement("p");
            description.innerText = source.description || source.snippet || source.url || "Referenced document.";

            item.appendChild(title);
            item.appendChild(description);
            list.appendChild(item);
        });

        toggle.addEventListener("click", () => {
            const expanded = panel.classList.toggle("expanded");
            if (expanded) {
                toggle.innerHTML = `<span><i class="fa-solid fa-eye"></i> Hide Evidence</span><i class="fa-solid fa-chevron-up"></i>`;
            } else {
                toggle.innerHTML = `<span><i class="fa-solid fa-eye"></i> Show Evidence</span><i class="fa-solid fa-chevron-down"></i>`;
            }
        });

        panel.appendChild(toggle);
        panel.appendChild(list);
        return panel;
    }

    // Helper to format time
    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }

    // Helper to scroll messages panel to bottom
    function scrollToBottom() {
        chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
    }

    // Show typing loader
    function showTypingIndicator() {
        // Move typing indicator to the bottom of the messages list
        chatMessages.appendChild(typingIndicator);
        typingIndicator.style.display = "block";
        scrollToBottom();
    }

    // Hide typing loader
    function hideTypingIndicator() {
        typingIndicator.style.display = "none";
    }

    // Create and display welcome banner
    function showWelcomeScreen() {
        const welcomeBanner = document.createElement("div");
        welcomeBanner.classList.add("welcome-banner");
        welcomeBanner.innerHTML = `
            <div class="welcome-icon">
                <i class="fa-solid fa-robot"></i>
            </div>
            <div class="welcome-copy">
                <h2>Welcome to Groq AI Chatbot</h2>
                <p>Ask your AI assistant anything about Groq, Llama, FastAPI, or your current build.</p>
            </div>
        `;
        chatMessages.appendChild(welcomeBanner);
        
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            appendMessage("bot", "Hello! How can I help you today?");
        }, 800);
    }
});
