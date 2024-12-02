import { useState } from 'react';
import CheckBoxInput from '../../components/CheckBoxInput';
import Header from '../../components/Header';
import TextFieldInput from '../../components/TextFieldInput';
import './style.css';
import { db, auth } from '../../services/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

export default function UpKeepPage() {
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [selectedRepairs, setSelectedRepairs] = useState([]);

    const checkboxes = [
        { Id: "limpeza-caixa-dagua", Label: "Caixa D'água (Limpeza)" },
        { Id: "vazamento-caixa-dagua", Label: "Caixa D'água (Vazamento)" },
        { Id: "calhas", Label: "Calhas" },
        { Id: "recarga-extintor", Label: "Extintor (Recarga)" },
        { Id: "falta-dagua", Label: "Falta D'água" },
        { Id: "conserto-fechadura", Label: "Conserto de Fechadura" },
        { Id: "recarga-gas", Label: "Recarga de Gás" },
        { Id: "vazamento-telhado", Label: "Telhado (Vazamento)" },
        { Id: "troca-lampadas", Label: "Troca de Lâmpadas" },
        { Id: "conserto-hidraulica", Label: "Conserto de Hidráulica" },
        { Id: "conserto-eletrico", Label: "Conserto Elétrico" },
        { Id: "outros", Label: "Outros" },
    ];

    const handleCheckBoxChange = (id) => {
        setSelectedRepairs(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const repairData = {
            location,
            description,
            selectedRepairs,
            timestamp: new Date(),
            uid: auth.currentUser.uid,
        };

        try {
            await addDoc(collection(db, "repairs"), repairData);
            alert("Reparo enviado com sucesso!");
            // Reset form
            setLocation('');
            setDescription('');
            setSelectedRepairs([]);
        } catch (error) {
            console.error("Erro ao enviar reparo:", error);
            alert("Houve um erro ao enviar o reparo. Tente novamente.");
        }
    };

    return (
        <>
            <Header />
            <section className="upkeep-page">
                <h1>Bem-vindo! Como posso ajudá-lo(a) hoje?</h1>
                <form className='upkeep-forms' onSubmit={handleSubmit}>
                    <div className="pessoal">
                        <TextFieldInput
                            Label="Localização"
                            Id="location"
                            Require={true}
                            Value={location}
                            OnChange={(e) => {setLocation(e.target.value)}}
                        />
                    </div>
                    <fieldset>
                        <legend>Reparo(s) Necessário(s):</legend>
                        <section className="checkbox-group">
                            {checkboxes.map((checkbox, index) => (
                                <CheckBoxInput
                                    key={index}
                                    Id={checkbox.Id}
                                    Label={checkbox.Label}
                                    Checked={selectedRepairs.includes(checkbox.Id)}
                                    OnChange={() => {handleCheckBoxChange(checkbox.Id)}}
                                />
                            ))}
                        </section>
                    </fieldset>
                    <div>
                        <label className='poppins-bold' htmlFor="description">Descrição</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className='buttons'>
                        <button type="submit">Enviar</button>
                        <button type="reset" onClick={() => {
                            setLocation('');
                            setDescription('');
                            setSelectedRepairs([]);
                        }}>Cancelar</button>
                    </div>
                </form>
            </section>
        </>
    );
}
