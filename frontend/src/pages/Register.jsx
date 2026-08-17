import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            await api.post("/register/", {
                username: username.trim(),
                password,
            });

            setSuccess("Account created successfully! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err) {
            if (err.response?.data?.username) {
                setError(
                    Array.isArray(err.response.data.username)
                        ? err.response.data.username[0]
                        : err.response.data.username
                );
            } else if (err.response?.data?.password) {
                setError(
                    Array.isArray(err.response.data.password)
                        ? err.response.data.password[0]
                        : err.response.data.password
                );
            } else {
                setError("Registration failed. Please try a different username.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <header className="auth-header">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Get started with your minimalist To-Do list</p>
                </header>

                {error && <div className="alert-message alert-error">{error}</div>}
                {success && <div className="alert-message alert-success">{success}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-username">
                            Username
                        </label>
                        <input
                            id="reg-username"
                            type="text"
                            className="form-input"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-password">
                            Password
                        </label>
                        <input
                            id="reg-password"
                            type="password"
                            className="form-input"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-confirm">
                            Confirm Password
                        </label>
                        <input
                            id="reg-confirm"
                            type="password"
                            className="form-input"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <footer className="auth-footer">
                    <p className="auth-switch-text">
                        Already have an account?{" "}
                        <Link to="/login" className="auth-link">
                            Login
                        </Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default Register;