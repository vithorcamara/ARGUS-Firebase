import Header from '../../components/Header';
import { useState, useEffect } from 'react';
import './style.css';
import { db, auth } from '../../services/firebaseConfig';
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfilePage() {
    const [userLogged, setUserLogged] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [userInfo, setUserInfo] = useState({
        Nome: "Carregando...",
        CPF: "Carregando...",
        Telefone: "Carregando...",
    });

    const [condominiumInfo, setCondominiumInfo] = useState({
        Condominio: "Carregando...",
        Apartamento: "Carregando...",
        Bloco: "Carregando...",
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);
    
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setUserLogged(userData); // Atualiza o estado de userLogged
                        setUserInfo({
                            Nome: userData.nome || "Não informado",
                            CPF: userData.cpf || "Não informado",
                            Telefone: userData.telefone || "Não informado",
                        });
                        setCondominiumInfo({
                            Condominio: userData.condominioNome || "Não informado",
                            Apartamento: userData.apartamento || "Não informado",
                            Bloco: userData.bloco || "Não informado",
                        });
                    } else {
                        console.log("Usuário não encontrado!");
                    }
                } catch (error) {
                    console.error("Erro ao buscar o usuário:", error);
                }
            } else {
                console.log("Nenhum usuário autenticado.");
            }
        });
    
        // Limpa o listener quando o componente é desmontado
        return () => unsubscribe();
    }, []);    

    useEffect(() => {
        if (userLogged) {
            setUserInfo({
                Nome: userLogged.nome || "Não informado",
                CPF: userLogged.cpf || "Não informado",
                Telefone: userLogged.telefone || "Não informado",
            });
            setCondominiumInfo({
                Condominio: userLogged.condominioNome,
                Apartamento: userLogged.apartamento,
                Bloco: userLogged.bloco,
            });
        }
    }, [userLogged]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Atualizar o estado correto com base no campo alterado
        if (condominiumInfo[name]) {
            setCondominiumInfo((prev) => ({ ...prev, [name]: value }));
        } else if (userInfo[name]) {
            setUserInfo((prev) => ({ ...prev, [name]: value }));
        }
    };
    

    const handleEditToggle = () => {
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid); // Referência ao documento do usuário
                console.log({
                    nome: userInfo.Nome,
                    cpf: userInfo.CPF,
                    telefone: userInfo.Telefone,
                    condominioNome: condominiumInfo.Condominio,
                    apartamento: condominiumInfo.Apartamento,
                    bloco: condominiumInfo.Bloco,
                })
                // Atualizando os campos no Firestore
                await updateDoc(userRef, {
                    nome: userInfo.Nome,
                    cpf: userInfo.CPF,
                    telefone: userInfo.Telefone,
                    condominioNome: condominiumInfo.Condominio,
                    apartamento: condominiumInfo.Apartamento,
                    bloco: condominiumInfo.Bloco,
                });
    
                console.log("Informações atualizadas com sucesso no Firestore!");
                setIsEditing(false); // Sai do modo de edição
            } else {
                console.log("Usuário não autenticado!");
            }
        } catch (error) {
            console.error("Erro ao atualizar as informações:", error);
        }
    };
    

    const handleCancel = () => {
        setUserInfo({
            Nome: userLogged.nome || "Não informado",
            CPF: userLogged.cpf || "Não informado",
            Telefone: userLogged.telefone || "Não informado",
        });
        setCondominiumInfo({
            Condominio: userLogged.condominioNome || "Não informado",
            Apartamento: userLogged.apartamento || "Não informado",
            Bloco: userLogged.bloco || "Não informado",
        });
        setIsEditing(false); // Sai do modo edição sem salvar
    };

    const formatLabel = (label) => {
        return label.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
    };

    useEffect(() => {
        console.log("isEditing atualizado:", isEditing);
    }, [isEditing]);

    return (
        <>
            <Header />
            <section className="profile-page">
                <h1>Perfil do Usuário</h1>
                <form className="profile-forms" onSubmit={handleSubmit}>
                    <h2>Informações Pessoais</h2>
                    <div className="fields-group">
                        {Object.keys(userInfo).map((key, index) => (
                            <div key={index} className="field-container">
                                <label htmlFor={key}>{formatLabel(key)}</label>
                                <input
                                    id={key}
                                    name={key}
                                    type={key === "age" ? "number" : "text"}
                                    value={userInfo[key]}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        ))}
                        {Object.keys(condominiumInfo).map((key, index) => (
                            <div key={index} className="field-container">
                                <label htmlFor={key}>{formatLabel(key)}</label>
                                <input
                                    id={key}
                                    name={key}
                                    type="text"
                                    value={condominiumInfo[key]}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="buttons">
                        {isEditing ? (
                            <>
                                <button type="submit">Salvar Alterações</button>
                                <button type="reset" onClick={handleCancel}>Cancelar</button>
                            </>
                        ) : (
                            <input type="button" value="Editar" onClick={handleEditToggle} />
                        )}
                    </div>
                </form>
            </section>
        </>
    );
}
