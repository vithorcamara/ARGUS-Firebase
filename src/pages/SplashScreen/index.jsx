import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../services/firebaseConfig'; // Certifique-se de que o arquivo de configuração do Firebase está configurado
import './style.css';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica o estado do usuário
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário está logado
        navigate("/home");
      } else {
        // Usuário não está logado
        navigate("/login");
      }
    });

    // Limpeza do listener
    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
        <section className="splash-screen-page">
            <a><img src="/logo1.png" alt="Argus" /></a>
        </section>
    </>
  );
}
