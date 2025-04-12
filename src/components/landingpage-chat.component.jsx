import React, { useEffect } from "react";

import { constants } from "../utils/constants";

import mic from "../asserts/images/mic.png";
import logo from "../asserts/images/logo.png";
import personImage from "../asserts/images/perso.jpg";
import chatPerson from "../asserts/images/chatPerson.png";

const LandingPageChat = (props) => {
  const { selectedTag, onClickSsExpanded, isExpanded } = props;

  // ----------------------------
  // 1. Local states
  // ----------------------------

  // Extra messages when selectedTag exists (we append them to constants.chatMessages)
  const [extraMessages, setExtraMessages] = React.useState([]);

  // Current input value in the expanded chat
  const [chatInputValue, setChatInputValue] = React.useState("");

  // For the scenario when selectedTag is NOT set:
  // We'll let user press Enter in the "Start Chatting Now" input to open a new chat
  const [showManualChat, setShowManualChat] = React.useState(false);

  // Messages for the manually opened chat (when selectedTag is falsy)
  const [manualChatMessages, setManualChatMessages] = React.useState([]);

  // Current input value in the manually opened chat
  const [manualChatInput, setManualChatInput] = React.useState("");

  // Current input in the "Start Chatting Now" box (when no selectedTag)
  const [startChatInput, setStartChatInput] = React.useState("");

  const [threadId, setThreadId] = React.useState("");

  useEffect(() => {
    const handleThread = async () => {
      try {
        // Fetch Thread ID from backend
        const threadResponse = await fetch(
          "https://e-bizone-backend.vercel.app/create-thread/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!threadResponse.ok) {
          throw new Error("Failed to create thread");
        }

        const threadData = await threadResponse.json();
        const threadIdData = threadData.Thread_ID; // Extract thread ID

        if (!threadIdData) {
          throw new Error("Thread ID is missing");
        }

        setThreadId(threadIdData);

        console.log(threadIdData);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };

    handleThread();
  }, []);

  // handle GPT Chat

  const handleGPTChat = async () => {
    try {
      if (!threadId) {
        throw new Error("Thread ID is missing");
      }

      const requestData = new URLSearchParams({
        message: chatInputValue | manualChatInput,
        thread_id: threadId,
      });

      // console.log(threadId)

      console.log(requestData);

      // Now, send message to GPT endpoint
      const gptResponse = await fetch(
        "https://e-bizone-backend.vercel.app/ASK-GPT/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: requestData,
        }
      );

      if (!gptResponse.ok) {
        throw new Error("Failed to send message");
      }

      const gptData = await gptResponse.json();

      if (gptData.Response) {
        return gptData;
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // ----------------------------
  // 2. Handlers
  // ----------------------------
  const onClickExpandcontract = () => {
    onClickSsExpanded(!isExpanded);
  };

  const handleSendChatMessage = async () => {
    if (chatInputValue.trim() !== "") {
      setExtraMessages((prev) => [
        ...prev,
        { type: "response", text: chatInputValue }, // User message
      ]);
      const gptData = await handleGPTChat();
      console.log(gptData);
      setExtraMessages((prev) => [
        ...prev,
        { type: "message", text: gptData.Response },
      ]);
      // Clear input field after sending
      setChatInputValue("");
    }
  };

  // For sending a message in the manually opened chat (when selectedTag is false)
  const handleSendManualChatMessage = async () => {
    if (manualChatInput.trim() !== "") {
      setManualChatMessages((prev) => [
        ...prev,
        { type: "response", text: manualChatInput },
      ]);
      const gptData = await handleGPTChat();
      console.log(gptData);
      setManualChatMessages((prev) => [
        ...prev,
        { type: "message", text: gptData.Response },
      ]);
      setManualChatInput("");
    }
  };

  // If user presses enter in the "Start Chatting Now" box (when selectedTag is not set)
  // we open the manual chat and push the first user message.
  const handleStartChat = async () => {
    if (startChatInput.trim() !== "") {
      setShowManualChat(true);
      setManualChatMessages([{ type: "response", text: startChatInput }]);
      const gptData = await handleGPTChat();
      console.log(gptData);
      setManualChatMessages((prev) => [
        ...prev,
        { type: "message", text: gptData.Response },
      ]);
      setStartChatInput("");
    }
  };

  return (
    <div
      style={isExpanded ? { marginTop: "0%" } : undefined}
      className="chat-section"
    >
      {/* -------------------------
        3. If selectedTag exists
      ------------------------- */}
      {selectedTag ? (
        <>
          <div className="container">
            <div
              className="chat-container"
              style={
                !isExpanded ? { maxHeight: "45vh" } : { maxHeight: "600px" }
              }
            >
              <div className="chat-header">
                <strong>{selectedTag}</strong>
                <span
                  onClick={() => onClickExpandcontract()}
                  className="fullscreen-icon"
                >
                  ⛶
                </span>
              </div>

              <div
                className="chat-messages"
                style={
                  !isExpanded ? { maxHeight: "45vh" } : { maxHeight: "590px" }
                }
              >
                {/* Existing messages from constants */}
                {constants.chatMessages.map((chat, index) => (
                  <React.Fragment key={index}>
                    {chat.type === "message" && (
                      <div className="chat-message">
                        <img src={chat.image} alt="User" className="avatar" />
                        <p>{chat.text}</p>
                      </div>
                    )}
                    {chat.type === "response" && (
                      <div className="chat-response">
                        <p>{chat.text}</p>
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {/* New extra messages the user sends */}
                {extraMessages.map((chat, index) => (
                  <React.Fragment key={`extra-${index}`}>
                    {chat.type === "message" && (
                      <div className="chat-message">
                        <img
                          src={chat.image ? chat.image : chatPerson}
                          alt="User"
                          className="avatar"
                        />
                        <p>{chat.text}</p>
                      </div>
                    )}
                    {chat.type === "response" && (
                      <div className="chat-response">
                        <p>{chat.text}</p>
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {/* Input to type new messages in the expanded chat */}
                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={chatInputValue}
                    onChange={(e) => setChatInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendChatMessage();
                      }
                    }}
                  />
                  <img src={mic} alt="mic" className="mic-icon" />
                </div>
              </div>
            </div>

            <div className="profile-container">
              <img
                src={personImage}
                alt="AI Profile"
                className="profile-image"
              />
              <div className="profile-footer">
                <button className="play-button">▶</button>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* -------------------------
        4. If selectedTag is false
          - Show either "Start Chatting Now" 
            OR (if user pressed Enter) the new manual chat
      ------------------------- */}

      {!selectedTag && !showManualChat && (
        <>
          <h1 className="heading">Start Chatting Now:</h1>
          <div className="chat-row">
            <div className="chat-input-container">
              <input
                type="text"
                placeholder="Welcome to Ebizoncloud AI World, How can I help you?"
                value={startChatInput}
                onChange={(e) => setStartChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleStartChat();
                  }
                }}
              />
              <img src={mic} alt="mic" className="mic-icon" />
            </div>
            <div className="logo">
              <img className="logo" src={logo} alt="logo" />
              <div className="text-wrapper">
                <p>Discover, Migrate, Manage &amp; Control</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Now show the manually opened chat if user typed a message */}
      {!selectedTag && showManualChat && (
        <div className="container">
          <div
            className="chat-container"
            style={!isExpanded ? { maxHeight: "45vh" } : { maxHeight: "600px" }}
          >
            <div className="chat-header">
              <strong>Chat</strong>
              <span
                onClick={() => onClickExpandcontract()}
                className="fullscreen-icon"
              >
                ⛶
              </span>
            </div>

            <div
              className="chat-messages"
              style={
                !isExpanded ? { maxHeight: "45vh" } : { maxHeight: "590px" }
              }
            >
              {/* Only our manual messages here, no constants */}
              {manualChatMessages.map((chat, index) => (
                <React.Fragment key={index}>
                  {chat.type === "message" && (
                    <div className="chat-message">
                      <img
                        src={chat.image ? chat.image : chatPerson}
                        alt="User"
                        className="avatar"
                      />
                      <p>{chat.text}</p>
                    </div>
                  )}
                  {chat.type === "response" && (
                    <div className="chat-response">
                      <p>{chat.text}</p>
                    </div>
                  )}
                </React.Fragment>
              ))}

              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={manualChatInput}
                  onChange={(e) => setManualChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendManualChatMessage();
                    }
                  }}
                />
                <img src={mic} alt="mic" className="mic-icon" />
              </div>
            </div>
          </div>

          <div className="profile-container">
            <img src={personImage} alt="AI Profile" className="profile-image" />
            <div className="profile-footer">
              <button className="play-button">▶</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageChat;
