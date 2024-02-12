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

  fileUpload.addEventListener("change", async function () {
    if (this.files.length === 0) {
      return;
    }
  
    const file = this.files[0];
    const reader = new FileReader();
  
    reader.onload = async function (event) {
      const fileContent = event.target.result;
  
      // Now you can send `fileContent` to your server along with the user's message.
      // This will depend on how your server expects to receive file content.
      // For example, if your server expects a JSON payload with a `fileContent` field:
      const response = await chatbotApi.fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: chatInput.value,
          image: fileContent,
        }),
      });
  
      if (response.ok) {
        // If the server responded with a status code of 200-299, the upload was successful.
        // Change the text of the upload button to indicate this.
        document.querySelector('.icon-button').innerHTML = '<i class="fas fa-check"></i> Uploaded';
      } else {
        // If the server responded with a status code outside of 200-299, the upload failed.
        // Change the text of the upload button to indicate this.
        document.querySelector('.icon-button').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Upload failed';
      }
    };
  
    reader.readAsDataURL(file); // Convert the file to Base64
  });

  // fired when the chat form is submitted
  chatForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    // disable input and button
    chatInput.toggleAttribute("disabled");
    chatButton.toggleAttribute("disabled");

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



    // call Gadget /chat HTTP route with stream option
    const response = await chatbotApi.fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: chatInputValue,
      }),
      stream: true,
    });

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
        chatInput.toggleAttribute("disabled");
        chatButton.toggleAttribute("disabled");
        chat.removeChild(chatbotThinking);
        break;
      }

      // append the stream data to the response text
      replyText += value;
      // use DOMPurify to sanitize the response before adding to the DOM
      chatbotResponse.innerHTML = DOMPurify.sanitize(replyText);
    }
  });

  chatbotToggle.addEventListener("click", function () {
    // toggle visibility of chatbot window
    chatbotWindow.classList.toggle("visible");
    chatbotOpenToggle.classList.toggle("hidden");
    chatbotCloseToggle.classList.toggle("hidden");
  });
});
