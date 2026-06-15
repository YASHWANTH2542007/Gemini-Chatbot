const API_KEY = "AQ.Ab8RN6JtMWdMdi0J81lEATeIu7FOhVOMrB24P6y1YL3JADeAuQ";
const API_URL =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

async function generateResponse(prompt) {
    try {

        const response = await fetch(
            `${API_URL}?key=${API_KEY}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
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
            }
        );

        const data = await response.json();

        console.log("Gemini:", data);

        if (!response.ok) {
            throw new Error(
                data?.error?.message ||
                "API Error"
            );
        }

        return (
            data?.candidates?.[0]
            ?.content?.parts?.[0]
            ?.text
            ||
            "No response generated."
        );

    } catch (err) {

        console.error(err);

        return "Unable to connect to Gemini.";

    }
}

function cleanMarkdown(text) {

    return text
        .replace(/#{1,6}\s?/g, "")
        .replace(/\*\*/g, "")
        .trim();

}

function addMessage(message, isUser) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        `message ${
            isUser
            ? "user-message"
            : "bot-message"
        }`;

    wrapper.innerHTML =
`
<img
class="profile-image"
src="${
isUser
? "user.jpg"
: "bot.jpg"
}">

<div class="message-content">
${message}
</div>
`;

    chatMessages.appendChild(
        wrapper
    );

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}

async function handleUserInput() {

    const msg =
        userInput.value.trim();

    if (!msg)
        return;

    addMessage(
        msg,
        true
    );

    userInput.value = "";

    sendButton.disabled =
        true;

    try {

        const reply =
            await generateResponse(
                msg
            );

        addMessage(
            cleanMarkdown(
                reply
            ),
            false
        );

    } finally {

        sendButton.disabled =
            false;

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
            e.key === "Enter"
        ) {

            e.preventDefault();

            handleUserInput();

        }

    }
);
