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

        // Add user message to UI
        appendMessage("user", messageText);

        // Show typing indicator
        showTypingIndicator();

        try {
            // Send request to FastAPI backend
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

            // Simulate a natural-feeling short typing delay (550ms) for high-fidelity experience
            setTimeout(() => {
                hideTypingIndicator();
                appendMessage("bot", data.response);
            }, 550);

        } catch (error) {
            console.error("Error communicating with chatbot API:", error);
            setTimeout(() => {
                hideTypingIndicator();
                appendMessage("bot", "Oops! I ran into an error connecting to the server. Please check the server logs and try again later.");
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
    function appendMessage(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("message-content");
        contentDiv.innerText = text;

        const metaDiv = document.createElement("div");
        metaDiv.classList.add("message-meta");
        metaDiv.innerText = formatTime(new Date());

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(metaDiv);
        chatMessages.appendChild(messageDiv);

        // Scroll to the bottom of the container
        scrollToBottom();
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
        chatMessages.scrollTop = chatMessages.scrollHeight;
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
            <i class="fa-solid fa-comments"></i>
            <h2>Welcome to Groq AI Chatbot!</h2>
            <p>I am an AI assistant powered by Groq Llama 3 and FastAPI. Ask me anything!</p>
        `;
        chatMessages.appendChild(welcomeBanner);
        
        // Add a slight initial delay before the bot says hello
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            appendMessage("bot", "Hello! How can I help you today?");
        }, 800);
    }
});
