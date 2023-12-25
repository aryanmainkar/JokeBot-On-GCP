const chatDisplay = document.getElementById('chat-display');
const userInput = document.getElementById('user-input');

function appendMessage(sender, text) {
    const message = `<div class="message"><strong>${sender}:</strong> ${text}</div>`;
    chatDisplay.innerHTML += message;
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function sendMessage() {
    const userMessage = userInput.value.trim(); // Trim to remove leading and trailing whitespaces
    if (userMessage !== '') {
        appendMessage('You', userMessage);
        userInput.value = '';

        fetch('/api/dialogflow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userMessage }),
            })
            .then(response => response.json())
            .then(data => {
                const botMessage = data.botMessage;
                appendMessage('Bot', botMessage);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior of the Enter key (e.g., adding a new line)
        sendMessage(); // Call the sendMessage function
    }
});