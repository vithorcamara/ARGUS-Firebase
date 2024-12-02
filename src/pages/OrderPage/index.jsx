import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from '../../services/firebaseConfig';
import Header from "../../components/Header";
import OrderCard from "../../components/OrderCard";
import gateIcon from "../../assets/gateIcon.png";
import "./style.css";

export default function OrderPage() {
  const [orderSend, setOrderSend] = useState(false);
  const [orders, setOrders] = useState([]); // State para armazenar as orders
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
          if (currentUser) {
            try {
              const userRef = doc(db, "users", currentUser.uid);
              const userSnapshot = await getDoc(userRef);
  
              if (userSnapshot.exists()) {
                const userCpf = userSnapshot.data().cpf;
                const ordersRef = collection(db, "order");
                const ordersQuery = query(ordersRef, where("recipient", "==", userCpf));
                const ordersSnapshot = await getDocs(ordersQuery);
                console.log(ordersSnapshot, userCpf)
  
                const fetchedOrders = ordersSnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
  
                setOrders(fetchedOrders);
              } else {
                console.error("Usuário não encontrado no Firestore.");
              }
            } catch (error) {
              console.error("Erro ao buscar encomendas:", error);
            }
          } else {
            console.log("Nenhum usuário autenticado.");
          }
        });
  
        return () => unsubscribe();
      } catch (error) {
        console.error("Erro geral no fetchOrders:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  

  const fields = [
    {
      Id: "reservation-code",
      Label: "Código de retirada",
      Type: "text",
      Require: true,
    },
    {
      Id: "record-number",
      Label: "Número de registro",
      Type: "text",
      Require: true,
    },
    {
      Id: "type",
      Label: "Tipo",
      Type: "select",
      Require: true,
      Options: ["Documento", "Pacote", "Outro"],
    },
    {
      Id: "date",
      Label: "Data do recebimento",
      Type: "date",
      Require: true,
    },
    {
      Id: "recipient",
      Label: "Destinatário",
      Type: "text",
      Require: true,
    },
    {
      Id: "received-by",
      Label: "Recebido por",
      Type: "text",
      Require: true,
    },
  ];

  const [formData, setFormData] = useState({
    reservation_code: "",
    record_number: "",
    type: "",
    date: "",
    recipient: "",
    received_by: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const submitSend = (e) => {
    e.preventDefault();
    console.log("Encomenda enviada:", formData);
    resetSend();
  };

  const resetSend = () => {
    setFormData({
      reservation_code: "",
      record_number: "",
      type: "",
      date: "",
      recipient: "",
      received_by: "",
      description: "",
    });
    setOrderSend(false); // Fechar o formulário ao resetar
  };

  return (
    <>
      <Header />
      <div className="order-page">
        <div className="left-sidebar">
          <div className="chat-icon" onClick={toggleChat}>
            <img
              src={gateIcon}
              className="gate-icon"
              alt="Chat com a portaria"
            />
            <p className="chat-text">Portaria</p>
          </div>
          {isChatOpen && (
            <div className="chat-box">
              <div className="chat-header">
                <h2 className="poppins-bold">Chat com a portaria</h2>
                <button className="close-chat" onClick={toggleChat}>
                  X
                </button>
              </div>
              <div className="chat-body">
                <p><strong>Portaria:</strong> Como posso ajudar?</p>
                <p><strong>Você:</strong> Olá, tenho uma dúvida sobre minha encomenda.</p>
              </div>
              <input
                type="text"
                className="chat-input"
                placeholder="Digite sua mensagem..."
              />
            </div>
          )}
        </div>

        <div className="main-content">
          {orderSend ? (
            <form className="order-forms" onSubmit={submitSend}>
              <div className="fields-group">
                {fields.map((field, index) => (
                  <div key={index} className="field-container">
                    <label htmlFor={field.Id}>{field.Label}</label>
                    {field.Type === "select" ? (
                      <select
                        id={field.Id}
                        name={field.Id}
                        required={field.Require}
                        value={formData[field.Id]}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Selecione
                        </option>
                        {field.Options.map((option, idx) => (
                          <option key={idx} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={field.Id}
                        name={field.Id}
                        type={field.Type}
                        required={field.Require}
                        value={formData[field.Id]}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                ))}
                <label className="poppins-bold" htmlFor="description">
                  Descrição
                </label>
                <div className="description-container">
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descreva aqui..."
                  ></textarea>
                </div>
              </div>
              <div className="buttons">
                <button type="submit">Enviar</button>
                <button type="button" onClick={resetSend}>Cancelar</button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <h1 className="page-title">Bem-vindo! Aqui estará registrado a entrega de suas encomendas.</h1>
                <button className="register-button" onClick={() => setOrderSend(true)}>Cadastrar Nova Encomenda</button>
              </div>
              <main className="order-list">
                {isLoading ? (
                  <p>Carregando encomendas...</p>
                ) : orders.length === 0 ? (
                  <p>Nenhuma encomenda encontrada.</p>
                ) : (
                  orders.map((order, index) => <OrderCard key={index} order={order} />)
                )}
              </main>
            </>
          )}
        </div>
      </div>
    </>
  );
}
