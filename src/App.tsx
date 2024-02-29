import { useState, useEffect, useRef, useLayoutEffect  } from "react";
import "./App.css";
import backgroundImage from './assets/bg-whatsapp.png';


function App() {
  const [messages, setMessages] = useState([
    {
      name: "Santiago",
      message: "Hi",
    },
    {
      name: "Maria",
      message: "Hello",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [userName, setUserName] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);


  const generateStrangeName = () => {
    const syllables = ["br", "in", "ex", "ar", "al", "gor", "zim", "qua", "eri", "ont", "yui", "vex", "kul", "los", "fen"];
    const nameLength = Math.floor(Math.random() * 3) + 2; 
    let name = "";
  
    for (let i = 0; i < nameLength; i++) {
      name += syllables[Math.floor(Math.random() * syllables.length)];
    }
  
    return name.charAt(0).toUpperCase() + name.slice(1); 
  };

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    } else {
      const randomName = generateStrangeName();
      localStorage.setItem("userName", randomName);
      setUserName(randomName);
    }
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { name: userName, message: newMessage }]);
      setNewMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);
  console.log(backgroundImage)
  
  return (
    <>
      <div className="container-fluid  vh-100 d-flex align-items-center bg-202c33">
        <div className="container w-100 shadow rounded bg-0c151b" style={{ maxWidth: '500px' }}>
          <div className="messages">
            <div className="messages-header" >
              <h2 className="text-white">Messages</h2>
            </div>
            <hr className="text-white" />
            <div className="chat-area">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble-container ${msg.name === userName ? "sender" : ""}`}>
                  <div className="chat-bubble">
                    <span style={{ fontSize: "0.7rem" }}>
                      <span>{msg.name === userName ? "You" : msg.name}</span>
                    </span>
                    <span style={{ display: "block" }}>{msg.message}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="container-fluid">
              <form className="input-group mb-3" onSubmit={sendMessage}>
                <input
                  type="text"
                  className="form-control p-2"
                  placeholder="Type something..."
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary text-white  d-flex align-items-center justify-content-center"
                  type="submit"
                  id="button-addon2"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
