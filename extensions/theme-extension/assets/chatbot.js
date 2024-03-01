document.addEventListener("DOMContentLoaded", function () {
  // initialize an API client object
  const chatbotApi = new Gadget();

  // dom elements for chatbot
  const chatbotWindow = document.getElementById("chatbot-window");
  const chat = document.getElementById("chat");
  const chatForm = document.getElementById("chat-form");
  const chatInput = chatForm.elements.chatInput;
  // const chatHeader = document.getElementById("chat-header");
  const chatButton = chatForm.elements.chatButton;
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbotOpenToggle = document.getElementById("chatbot-open-toggle");
  const chatbotCloseToggle = document.getElementById("chatbot-close-toggle");
  const closeIcon = document.getElementById("close-icon");
  const fileUpload = document.getElementById('file-upload');
  const previewContainer = document.getElementById('upload-preview-container');

  // fired when the chat form is submitted
  chatForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    // disable input and button
    chatInput.toggleAttribute("disabled");
    chatButton.toggleAttribute("disabled");

    // const formData = new FormData();
    
    // get user-inputted message
    const chatInputValue = chatInput.value;
    chatInput.value = "";
    // formData.append("message", chatInputValue); 
    
    // const file = fileUpload.files[0];
    // if (file) {
    //   formData.append("image", file);
    // }
    
    let payload = {
      'Message': chatInputValue,
    }

    const toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

    if (fileUpload.files && fileUpload.files.length > 0) {
      let imageFile = fileUpload.files[0];
      let imagePart = {
        'FileName': imageFile.name,
        'FileType': imageFile.type,
        'FileContent': await toBase64(imageFile)
      };
      payload = {
        ...payload,
        'Image': imagePart
      };
    }

    // add input to chat window and disable input
    const userInput = document.createTextNode(chatInputValue);
    const userChatBubble = document.createElement("span");
    userChatBubble.classList.add("user");
    userChatBubble.appendChild(userInput);
    chat.appendChild(userChatBubble);

    // add DOM elements for response
    const chatbotResponse = document.createElement("p");
    chatbotResponse.classList.add("bot");
    chat.appendChild(chatbotResponse);

    // add DOM elements for "thinking" indicator
    const chatWindow = document.getElementById('chat');
    const chatbotThinking = document.createElement("p");
    const chatbotThinkingText = document.createTextNode(
      "Finding the most suited product..."
    );
    chatbotThinking.appendChild(chatbotThinkingText);
    chat.appendChild(chatbotThinking);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    // call Gadget /chat HTTP route with stream option
    let response;
    try {
      response = await chatbotApi.fetch("/chat", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        stream: true,
      });
  
      if (response.ok) {
        // Handle successful submission here
        console.log('Message and file sent successfully');
      } else {
        // Handle server errors or invalid responses here
        console.error('Failed to send message and file');
      }
    } catch (error) {
      // Handle network or unexpected errors here
      console.error('Error sending message and file:', error);
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
        chatInput.toggleAttribute("disabled");
        chatButton.toggleAttribute("disabled");
        chat.removeChild(chatbotThinking);
        break;
      }

      // append the stream data to the response text
      replyText += value;
      // use DOMPurify to sanitize the response before adding to the DOM
      chatbotResponse.innerHTML = DOMPurify.sanitize(replyText);
      
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  });

  chatbotToggle.addEventListener("click", function () {
    // toggle visibility of chatbot window
    chatbotWindow.classList.toggle("visible");
    chatbotOpenToggle.classList.toggle("hidden");
    chatbotCloseToggle.classList.toggle("hidden");
  });

  closeIcon.addEventListener("click", function () {
    chatbotWindow.classList.toggle("visible");
    chatbotOpenToggle.classList.toggle("hidden");
    chatbotCloseToggle.classList.toggle("hidden");
  });

  async function fileUploadOnChange(event) {
    console.log('triggering');
    const previewElement = document.createElement('div');
    const name = document.createElement('span');
    const thumbnail = document.createElement('img');
    const deleteButton = document.createElement('button');
    const xIcon = document.getElementById("lucide-x").cloneNode(true);
    deleteButton.appendChild(xIcon);

    var reader = new FileReader();
    reader.onload = function () {
      thumbnail.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);

    name.textContent = event.target.files[0].name;
    previewElement.appendChild(thumbnail);
    previewElement.appendChild(name);
    previewElement.appendChild(deleteButton);
    previewContainer.appendChild(previewElement);
    deleteButton.addEventListener('click', function () {
      previewContainer.removeChild(previewElement);
      fileUpload.value = null;
      fileUpload.addEventListener('input', fileUploadOnChange);
    });
  };

  fileUpload.addEventListener("input", fileUploadOnChange);
});
