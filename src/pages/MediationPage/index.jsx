import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Header from '../../components/Header';
import './style.css';
import { db, auth } from '../../services/firebaseConfig';
import { collection, addDoc, getDoc, doc } from "firebase/firestore";

const genAI = new GoogleGenerativeAI("AIzaSyCrdvZOg_tiVVLbrsLDKStSe_t_ikAhLUI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const chat = model.startChat({ history: [] });

export default function MediationPage() {
    const [chatVisible, setChatVisible] = useState(false);
    
    const [messages, setMessages] = useState([
        { sender: "Assistente", text: "Como posso ajudar você?", timestamp: Date.now() }
    ]);

    const [currentMessage, setCurrentMessage] = useState("");

    const toggleChat = () => {
        setChatVisible(!chatVisible);
    };

    const fields = [
        { Id: "data-ocorrencia", Label: "Data do Ocorrido", Type: "date", Require: true },
        { Id: "tipo-conflito", Label: "Tipo de Conflito", Type: "select", Require: true, Options: ["Problemas com lixos", "Quebra de regras e normas", "Reformas", "Uso indevido em áreas comuns", "Barulho", "Discursão", "Briga"] },
        { Id: "onde-ocorreu", Label: "Onde Ocorreu", Type: "text", Require: true },
        { Id: "envolvencia", Label: "Envolvência", Type: "select", Require: false, Options: ["Estou diretamente envolvido", "Estou indiretamente envolvido", "Conheço os envolvidos", "Desconheço os envolvidos"] },
        { Id: "urgencia", Label: "Urgência", Type: "select", Require: false, Options: ["Baixa", "Média", "Alta"] },
        { Id: "status", Label: "Status", Type: "select", Require: false, Options: ["Em andamento", "Cessado"] },
    ];

    const sendMessageToGemini = async (userMessage) => {
        try {
            const res = await chat.sendMessage(`Você é um assistente de mediação de conflitos. Responda de forma curta apenas com texto: ${userMessage}`);
            const text = res?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) {
                return text;
            } else {
                throw new Error("Resposta inválida da API");
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem para o Gemini:", error);
            return "Desculpe, ocorreu um erro ao processar sua mensagem.";
        }
    };

    const handleSendMessage = async () => {
        if (currentMessage.trim() !== "") {
            const userMessage = {
                sender: "Você",
                text: currentMessage,
                timestamp: Date.now(),
            };
            setMessages([...messages, userMessage]); 
            setCurrentMessage(""); 

            const aiResponse = await sendMessageToGemini(currentMessage);
            const geminiMessage = {
                sender: "Assistente",
                text: aiResponse,
                timestamp: Date.now(),
            };
            setMessages((prevMessages) => [...prevMessages, geminiMessage]);
        }
    };

    const [formValues, setFormValues] = useState({
        "data-ocorrencia": "",
        "tipo-conflito": "",
        "onde-ocorreu": "",
        envolvencia: "",
        urgencia: "",
        status: "",
        description: "",
        idUsuario: auth.currentUser ? auth.currentUser.uid : ""
    });

    const handleChange = (field, value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formValues)
            await addDoc(collection(db, "mediation"), formValues);
            alert("Mediação enviada com sucesso!");
            
            setFormValues({
                "data-ocorrencia": "",
                "tipo-conflito": "",
                "onde-ocorreu": "",
                envolvencia: "",
                urgencia: "",
                status: "",
                description: "",
                idUsuario: auth.currentUser.uid
            });
            window.location.href = "/home";
        } catch (error) {
            console.error("Erro ao enviar a mediação:", error);
            alert("Houve um erro ao enviar a mediação. Tente novamente.");
        }
    };

    return (
        <>
            <Header />
            <section className="mediation-page">
                <h1>Bem-vindo! Informe o seu ocorrido</h1>
                <form className="mediation-forms" onSubmit={handleSubmit} method="POST">
                    <div className="fields-group">
                         {fields.map((field, index) => (
                            <div key={index} className="field-container">
                                <label htmlFor={field.Id}>{field.Label}</label>
                                {field.Type !== "select" ? (
                                    <input
                                        id={field.Id}
                                        name={field.Id}
                                        type={field.Type}
                                        required={field.Require}
                                        value={formValues[field.Id] || ""}
                                        onChange={(e) => handleChange(field.Id, e.target.value)}
                                    />
                                ) : (
                                    <select
                                        id={field.Id}
                                        name={field.Id}
                                        value={formValues[field.Id] || ""}
                                        onChange={(e) => handleChange(field.Id, e.target.value)}
                                    >
                                        <option value="">Selecione uma opção</option>
                                        {field.Options.map((option, index) => (
                                            <option key={index} value={option.toLowerCase()}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="description-container">
                        <label htmlFor="description">Descrição do Ocorrido</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            placeholder="Descreva aqui o que aconteceu"
                            value={formValues.description || ""}
                            onChange={(e) => handleChange("description", e.target.value)}
                        ></textarea>
                    </div>
                    <div className="buttons">
                        <button type="submit">Enviar</button>
                        <button type="reset" onClick={() => {
                            setFormValues({
                                "data-ocorrencia": "",
                                "tipo-conflito": "",
                                "onde-ocorreu": "",
                                envolvencia: "",
                                urgencia: "",
                                status: "",
                                description: "",
                                idUsuario: auth.currentUser.uid
                            })
                        }}>Cancelar</button>
                    </div>
                </form>
            </section>

            <button className="floating-button" onClick={toggleChat}>
                Chat
            </button>

            {chatVisible && (
                <div className={`chat-popup ${chatVisible ? 'visible' : ''}`}>
                    <h2>Assistente Virtual</h2>
                    <div className="chat-content">
                        {messages
                            .sort((a, b) => a.timestamp - b.timestamp)
                            .map((message, index) => (
                                <div key={index} className={`chatbot-message ${message.sender === "Você" ? "sent" : "received"}`}>
                                    <p>{message.text}</p>
                                    <span className="timestamp">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            ))}
                    </div>
                    <textarea
                        placeholder="Digite sua mensagem..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage(); 
                                e.preventDefault(); 
                            }
                        }}
                    ></textarea>
                    <button className="submitMessage" onClick={handleSendMessage}>Enviar</button>
                    <button className="quitChatBot" onClick={toggleChat}>Fechar</button>
                </div>
            )}
        </>
    );
}
