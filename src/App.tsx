import { useState, useEffect, useRef, useLayoutEffect } from "react";
import io from "socket.io-client";
import "./App.css";
import axios from "axios";

function formatarFecha(dateInput: any) {
  // Intenta convertir el input a un objeto Date si aún no lo es.
  const date = new Date(dateInput);

  // Verifica si la conversión fue exitosa verificando si la fecha es válida.
  if (isNaN(date.getTime())) {
    // Si la fecha no es válida, retorna un placeholder o maneja el error como prefieras.
    return "Fecha inválida";
  }

  let dia: any = date.getDate();
  dia = dia < 10 ? `0${dia}` : dia;

  let mes:any = date.getMonth() + 1; // getMonth() devuelve un índice basado en cero, por lo tanto, se suma 1.
  mes = mes < 10 ? `0${mes}` : mes;

  let año = date.getFullYear().toString().slice(-2); // Obtener los últimos dos dígitos del año

  let horas:any = date.getHours();
  let esPM = horas >= 12;
  horas = horas % 12;
  horas = horas ? horas : 12; // El valor 0 debe convertirse en 12.
  horas = horas < 10 ? `0${horas}` : horas;

  let minutos:any = date.getMinutes();
  minutos = minutos < 10 ? `0${minutos}` : minutos;

  return `${dia}/${mes}/${año}, ${horas}:${minutos} ${esPM ? 'PM' : 'AM'}`;
}

interface Message {
  name: string;
  message: string;
  date: string;
}


// Establece la conexión con Socket.IO fuera del componente para evitar múltiples conexiones
const socket = io("https://simple-chat-backend-2.onrender.com");

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [newMessage, setNewMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);

  const messagesEndRef: any = useRef(null);

  useEffect(() => {
    const socket = io("https://simple-chat-backend-2.onrender.com");

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("message_saved", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
      setIsNameSet(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://simple-chat-backend-2.onrender.com/api/messages");
        setMessages(response.data.data);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    fetchData();
  }, []);

  const handleNameSubmit = (e: any) => {
    e.preventDefault();
    const nameInput = e.target.elements.name.value.trim();
    if (nameInput) {
      setUserName(nameInput);
      setIsNameSet(true);
      localStorage.setItem("userName", nameInput);
    }
  };

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = { name: userName, message: newMessage };
      socket.emit("some_event", newMsg);
      setNewMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isNameSet) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-202c33">
        <form
          onSubmit={handleNameSubmit}
          autoComplete="off"
          className="d-flex align-items-center justify-content-center"
        >
          <input
            type="text"
            className="form-control p-2"
            style={{ maxWidth: "500px" }}
            id="name"
            placeholder="Type your name"
            required
          />
          &nbsp;
          <button className="btn btn-outline-secondary" type="submit">
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-202c33">
        <div
          className="container w-100 shadow rounded bg-0c151b"
          style={{ maxWidth: "500px" }}
        >
          <div className="messages">
            <div className="messages-header">
              <h2 className="text-white">Messages</h2>
            </div>
            <hr className="text-white" />
            <div className="chat-area">
              {messages.length > 0
                ? messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`chat-bubble-container ${
                        msg.name === userName ? "sender" : ""
                      }`}
                    >
                      <div className="chat-bubble">
                        <span style={{ fontSize: "0.7rem" }}>
                          <span>
                            {msg.name === userName ? "You" : msg.name}
                          </span>
                        </span>
                        <span style={{ display: "block" }}>{msg.message}</span>
                        <span className="chat-date">{formatarFecha(msg.date)}</span>
                      </div>
                    </div>
                  ))
                : null}
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
                  required
                />
                <button
                  className="btn btn-outline-secondary text-white d-flex align-items-center justify-content-center"
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
