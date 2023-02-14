import { useEffect, useState } from "react";
import Styles from "../Styles/login.module.scss";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    let data = window.localStorage.getItem("LOGIN_KEY");
    if (data !== null) {
        data = JSON.parse(data);
    }
    const [login, setLogin] = useState(
        () => data || false
    );
    useEffect(() => {
        window.localStorage.setItem("LOGIN_KEY", JSON.stringify(login));
    }, [login]);

    const logincheck = () => {
        if (username === "admin" && password === "admin") {
            setLogin(true);
            setError("");
            window.location.reload();
        }
        else {
            setLogin(false);
            setError("Invalid username or password.");
        }
    }

    return (
        <div className={Styles.login}>
            <div className={Styles.loginContainer}>
                <div className={Styles.loginHeader}>
                    <h1>Please Login</h1>
                </div>
                <div className={Styles.loginForm}>
                    <div className={Styles.loginInput}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className={Styles.loginInput}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className={Styles.loginError}>
                        {error}
                    </div>
                    <div className={Styles.loginButton}>
                        <button onClick={logincheck}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}