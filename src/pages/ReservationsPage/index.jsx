import { useState, useEffect } from "react";
import Header from "../../components/Header";
import "./style.css";
import { db, auth } from '../../services/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

export default function ReservationsPage() {
  const [userUid, setUserUid] = useState(null); // Estado para armazenar o uid do usuário
  const [formData, setFormData] = useState({
    "reservation-period": "",
    location: "",
    date: "",
    description: "",
    idUsuario: ""
  });

  // Função para lidar com a mudança no estado da autenticação
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserUid(user.uid); // Define o uid do usuário
      } else {
        setUserUid(null); // Se não estiver autenticado, zera o uid
      }
    });

    return () => unsubscribe(); // Limpa a subscrição quando o componente for desmontado
  }, []);

  useEffect(() => {
    if (userUid) {
      setFormData(prevData => ({ ...prevData, idUsuario: userUid }));
    }
  }, [userUid]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const formatDate = (date) => {
    if (!date) return "Não selecionada";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await addDoc(collection(db, "reservation"), formData);
      alert("Reserva enviada com sucesso!");
      // Reset form
      setFormData({
        "reservation-period": "",
        location: "",
        date: "",
        description: "",
        idUsuario: userUid // Atualiza com o uid do usuário
      });
      window.location.href = "/home";
    } catch (error) {
      console.error("Erro ao enviar reserva:", error);
      alert("Houve um erro ao enviar a reserva. Tente novamente.");
    }
  };

  if (!userUid) {
    return <div></div>;
  }
  
  const fields = [
    {
      Id: "reservation-period",
      Label: "Período da reserva*",
      Type: "select",
      Require: true,
      Options: ["Manhã", "Tarde", "Noite"],
    },
    {
      Id: "location",
      Label: "Escolha o local da reserva*",
      Type: "select",
      Require: true,
      Options: ["Salão de festas", "Quadra",],
    },
    { Id: "date", Label: "Selecione a data*", Type: "date", Require: true },
  ];

  return (
    <>
      <Header />
      <section className="reservations-page">
        <h1>Bem-vindo! Solicite sua reserva</h1>
        <form className="reservations-forms" onSubmit={handleSubmit} method="POST">
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
            <div className="description-container poppins-bold">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                placeholder="Descreva aqui o que vai acontecer"
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="extra-info">
            <p>
              <strong>INFORMAÇÕES SOBRE A RESERVA</strong>
            </p>
            <p>
              Data:{" "}
              <span className="reservation-info">
                {formatDate(formData.date)}
              </span>
            </p>
            <p>
              Local:{" "}
              <span className="reservation-info">
                {formData.location || "Nenhum local selecionado"}
              </span>
            </p>
            <p>
              Período:{" "}
              <span className="reservation-info">
                {formData["reservation-period"] || "Nenhum período selecionado"}
              </span>
            </p>
          </div>
          <div className="buttons">
            <button type="submit">Enviar</button>
            <button
              type="reset"
              onClick={() =>
                setFormData({ "reservation-period": "", location: "", date: "", description: "" })
              }
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
