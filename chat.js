const partA = "xia0ZKN3dWM19NWl9pTlNyVFNWVWt1N3NfUnh"; // "Wor"
const partB = "ja2NHNk94emZiczg4RFBHQTJ5MmJfZmhmRUE="; // "ld!"
const partC = "c2stc3ZjYWNjdC11Q1BXZGFBNVB6U0ZUcTBHdDdPLUx0"; // "Hel"
const partD = "c0VSRUZtcFozRmRGUmJpbXhxeXpmcllHcEE5eVQzQm"; // "lo "

function getPart(n) {
    switch(n) {
        case 1:
            return partA;
        case 2:
            return partB;
        case 3:
            return partC;
        case 4:
            return partD;
        default:
            return '';
    }
}

// Function to decode the Base64 string
function my_decoder() {
    const randomValue = Math.floor(Math.random() * 10);

    let combined;
    if (randomValue % 2 === 0) {
        combined = getPart(3) + getPart(4) + getPart(1) + getPart(2);
    } else {
        combined = [getPart(3), getPart(4), getPart(1), getPart(2)].join('');
    }

    let complexOperation = combined.split('').reverse().reverse().join('');

    const decodedString = atob(complexOperation);
    
    return decodedString;
}

// Function to display the typing indicator
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'block';
}

// Function to hide the typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'none';
}

// Function to simulate the typing dots animation
function animateTypingDots() {
    const typingDots = document.getElementById('typing-dots');
    let dotCount = 0;
    const interval = setInterval(() => {
        dotCount = (dotCount + 1) % 4; // Cycle through 0, 1, 2, 3
        typingDots.innerHTML = '.'.repeat(dotCount);
    }, 500); // Update every 500ms

    // Return a function to stop the animation
    return () => clearInterval(interval);
}

// Function to send messages to ChatGPT and receive responses
async function sendMessageToChatGPT(systemPrompt, articleContent, userMessage) {
    try {
		const my_var =  my_decoder();
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${my_var}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Article: ${articleContent}` },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content.trim();
        } else {
            throw new Error('No response choices available');
        }
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error);
        return `Error: ${error.message}`;
    }
}

// Function to display messages and save them to chatData
function displayMessage(role, message) {
    // Save the message to chatData
    chatData.push({ role: role, content: message });

    const chatOutput = document.getElementById('chat-output');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerHTML = `<strong>${role}:</strong> <p>${message}</p>`;
    chatOutput.appendChild(messageDiv);

    // Use a small timeout to ensure the DOM is updated before scrolling
    setTimeout(() => {
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}


// Function to send a custom message
async function sendMessage() {
    // Check if it's the first message
    //if (isFirstMessage) {
        // Display the initial prompt from the chatbot
        //const initialMessage = "Hi there! I’m NewsChat, your reading assistant. This article contains a wealth of data and insights. Feel free to ask me any questions you have about the data or the article in general.";
        //displayMessage('NewsChat', initialMessage);

        // Set the flag to false after the initial message is sent
        //isFirstMessage = false;
        //return;
    //}

    // Retrieve the user input
    const userMessage = document.getElementById('message-input').value.trim();

    // Check if the input is empty and return if it is
    if (!userMessage) {
        return; // Exit the function if input is empty
    }

    // Reset system prompt and article content to initial values
    systemPrompt = initialSystemPrompt;
    articleContent = initialArticleContent;

    // Clear the input area
    document.getElementById('message-input').value = '';

    // Display the user's message
    displayMessage('You', userMessage);

    // Show the typing indicator
    showTypingIndicator();
    const stopTypingDots = animateTypingDots();
	
	   // Convert the input to lowercase for case-insensitive checking
    const lowerCaseMessage = userMessage.toLowerCase();

    // Check if the input contains any of the relevant terms
    const chatPrompt = lowerCaseMessage.includes('summarize') ||
                       lowerCaseMessage.includes('takeaways') ||
                       lowerCaseMessage.includes('overview') ||
                       lowerCaseMessage.includes('highlight') ||
                       lowerCaseMessage.includes('summary') ||
                       lowerCaseMessage.includes('recap')
        ? "Summarize the article in your own style, focusing on these points: 60% have received at least one dose of the COVID-19 vaccine. No differences across genders or linguistics regions. Opinions are almost evenly split about vaccinating health workers, with nearly as many respondents opposing the mandate as supporting it. Solidarity has decreased and selfishness increased since the beginning of the crisis. Trust in the government has increased to over 54% after a low in January. Please do not use formatting characters such as **"
        : userMessage;

    // Send the message to ChatGPT and get a response
    const responseMessage = await sendMessageToChatGPT(systemPrompt, articleContent, chatPrompt);

    // Hide the typing indicator
    hideTypingIndicator();
    stopTypingDots();

    // Display ChatGPT's response
    displayMessage('NewsChat', responseMessage);
	
	//increment number of messages
	numberOfChats += 1;
}

// Add event listener for Enter key
document.getElementById('message-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent the default newline behavior
        sendMessage();
    }
});

