const API_KEY = 'AQ.Ab8RN6Ljx4TKD9p56CWzET302T1-mQnLnAARbFkWpwNure4hsQ';
const API_URL =
'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

async function generateResponse(prompt) {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        console.log("API Response:", data);

        if (!response.ok) {
            throw new Error(
                data.error?.message || "API request failed"
            );
        }

        return (
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response generated."
        );

    } catch (error) {
        console.error(error);
        return "Error connecting to Gemini API.";
    }
}

function cleanMarkdown(text) {
    return text
        .replace(/#{1,6}\s?/g, '')
        .replace(/\*\*/g, '')
        .trim();
}

function addMessage(message, isUser) {

    const msg = document.createElement("div");

    msg.className =
        `message ${isUser ? "user-message" : "bot-message"}`;

    msg.innerHTML = `
        <img
        class="profile-image"
        src="${isUser ? 'user.jpg' : 'bot.jpg'}">

        <div class="message-content">
            ${message}
        </div>
    `;

    chatMessages.appendChild(msg);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}

async function handleUserInput() {

    const text =
        userInput.value.trim();

    if (!text) return;

    addMessage(text, true);

    userInput.value = "";

    sendButton.disabled = true;

    try {

        const reply =
            await generateResponse(text);

        addMessage(
            cleanMarkdown(reply),
            false
        );

    } catch {

        addMessage(
            "Something went wrong.",
            false
        );

    } finally {

        sendButton.disabled = false;

        userInput.focus();

    }

}

sendButton.addEventListener(
    "click",
    handleUserInput
);

userInput.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            handleUserInput();
        }
    }
);
