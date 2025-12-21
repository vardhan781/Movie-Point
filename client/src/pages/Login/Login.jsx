import { useContext, useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { MovieContext } from "../../Context/MovieContext";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, register, auth } = useContext(MovieContext);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      await login({
        email: form.email,
        password: form.password,
      });
      navigate("/");
    } else {
      await register(form);
      navigate("/otp-verify", { state: { email: form.email } });
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <div className="input-group">
            <User size={18} />
            <input
              placeholder="Username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
        )}

        <div className="input-group">
          <Mail size={18} />
          <input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="input-group">
          <Lock size={18} />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button disabled={auth.loading}>
          {auth.loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>

        <p className="toggle-text">
          {isLogin ? "New to MoviePoint?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register" : " Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
