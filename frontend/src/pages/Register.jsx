import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

        try {
            await api.post("/register/", {
                username,
                password,
            });

            setSuccess("Account created successfully!");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            if (error.response?.data?.username) {
                setError(error.response.data.username[0]);
            } else if (error.response?.data?.password) {
                setError(error.response.data.password[0]);
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="login-container">
            <h1>Register</h1>

            {error && <p>{error}</p>}
            {success && <p>{success}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(e.target.value)
                    }
                    required
                />

                <button type="submit">
                    Register
                </button>
            </form>

            <p>
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            </p>
        </div>
    );
}

export default Register;