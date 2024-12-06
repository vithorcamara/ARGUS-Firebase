import "./style.css";
import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../services/firebaseConfig';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email + "@argus.com", password);
      window.location.href="/home";
      alert("Usuário autenticado com sucesso!");
    } catch (error) {
      alert("Erro ao autenticar: " + error.message);
    }
  };

  return (
    <>
      <section className="login-page">
        <div className="login-forms">
          <div className="logo-container">
            <img className="logo" src="/logo1.png" alt="argus" />
            <h1 className="logo-name">ARGUS</h1>
          </div>
          <p className="description poppins-bold">
            Olá!
            <br />
            Para continuar, digite seu CPF e senha.
          </p>
          <form onSubmit={handleLogin} method="post">
            <input
              className="poppins-semibold"
              type="text"
              id="cpf"
              name="cpf"
              placeholder="CPF*"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="poppins-semibold"
              type="password"
              id="password"
              name="password"
              placeholder="Senha*"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="additional-options">
              <div>
                <input type="checkbox" id="remember" name="remember" />
                <label className="poppins-regular" htmlFor="remember">
                  Lembrar Senha
                </label>
              </div>
              <a href="/recovery">
                <p>Esqueci minha senha</p>
              </a>
            </div>

            <input className="button" type="submit" value="ENTRAR" />
          </form>

          {/* Link de cadastro 
          <div className="register-link">
            <p className="poppins-regular">
              Ainda não tem uma conta? <a href="/register">Cadastre-se</a>
            </p>
          </div> */}
        </div>
      </section>
    </>
  );
}
