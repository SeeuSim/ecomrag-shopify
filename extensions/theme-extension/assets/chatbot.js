document.addEventListener("DOMContentLoaded", function () {
  // initialize an API client object
  const chatbotApi = new Gadget();

  // dom elements for chatbot
  const chatbotWindow = document.getElementById("chatbot-window");
  const chat = document.getElementById("chat");
  const chatForm = document.getElementById("chat-form");
  const chatInput = chatForm.elements.chatInput;
  const chatButton = chatForm.elements.chatButton;
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbotOpenToggle = document.getElementById("chatbot-open-toggle");
  const chatbotCloseToggle = document.getElementById("chatbot-close-toggle");

  const fileUpload = document.getElementById("file-upload");
  let fileContent = null;
  fileUpload.addEventListener("change", async function () {
    if (this.files.length === 0) {
      return;
    }

    const file = this.files[0];

    // File type validation
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // File size validation
    if (file.size > 2000000) { // 2MB
      alert('Please upload an image file smaller than 2MB');
      return;
    }

    const reader = new FileReader();

    reader.onload = async function (event) {
      fileContent = event.target.result;
    };

    reader.onerror = function () {
      alert('Failed to read file');
      reader.abort();
    };

    reader.readAsDataURL(file);
  });

  // fired when the chat form is submitted
  chatForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // get user-inputted message
    const chatInputValue = chatInput.value;
    chatInput.value = "";

    // add input to chat window and disable input
    const userInput = document.createTextNode(chatInputValue);
    const userChatBubble = document.createElement("span");
    userChatBubble.classList.add("user");
    userChatBubble.appendChild(userInput);
    chat.appendChild(userChatBubble);
    chat.appendChild(document.createElement("br"));
    chat.scrollTop = chat.scrollHeight;

    // add DOM elements for response
    const chatbotResponse = document.createElement("p");
    chatbotResponse.classList.add("bot");
    chat.appendChild(chatbotResponse);

    // add DOM elements for "thinking" indicator
    const chatbotThinking = document.createElement("p");
    const chatbotThinkingText = document.createTextNode("Thinking...");
    chatbotThinking.appendChild(chatbotThinkingText);
    chat.appendChild(chatbotThinking);

    try {
      // call Gadget /chat HTTP route with stream option
      const response = await chatbotApi.fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: chatInputValue,
          image: fileContent,
        }),
        stream: true,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // read from the returned stream
      const decodedStreamReader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      // handle any stream errors
      decodedStreamReader.closed.catch((error) => {
        // display stream error
        const chatbotError = document.createElement("p");
        chatbotError.classList.add("error");
        const chatbotErrorText = document.createTextNode(
          `Sorry, something went wrong: ${error.toString()}`
        );
        chatbotError.appendChild(chatbotErrorText);
        chat.appendChild(chatbotError);
        // also add error to console
        console.error(error.toString());
      });

      // parse the stream data
      let replyText = "";
      while (true) {
        const { value, done } = await decodedStreamReader.read();

        // stop reading the stream
        if (done) {
          chat.removeChild(chatbotThinking);
          break;
        }

        // append the stream data to the response text
        replyText += value;
        // use DOMPurify to sanitize the response before adding to the DOM
        chatbotResponse.innerHTML = DOMPurify.sanitize(replyText);
      }
    } catch (error) {
      const chatbotError = document.createElement("p");
      chatbotError.classList.add("error");
      const chatbotErrorText = document.createTextNode(
        `Sorry, something went wrong: ${error.toString()}`
      );
      chatbotError.appendChild(chatbotErrorText);
      chat.appendChild(chatbotError);
      console.error(error.toString());
    } finally {
      chatInput.toggleAttribute("disabled");
      chatButton.toggleAttribute("disabled");
    }
  });

  chatbotToggle.addEventListener("click", function () {
    // toggle visibility of chatbot window
    chatbotWindow.classList.toggle("visible");
    chatbotOpenToggle.classList.toggle("hidden");
    chatbotCloseToggle.classList.toggle("hidden");
  });
});