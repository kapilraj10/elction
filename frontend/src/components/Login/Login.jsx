import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/auth.service';
import './Login.css';
import { toast } from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await authService.login({ email, password });
            authService.saveAuth(res.token, res.user);
            toast.success('सफलतापूर्वक लगइन भयो');
            navigate('/');
        } catch (err) {
            setError(err?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page container">
            <div className="login-card">
                <h2>Login</h2>
                <p className="muted">Use your campaign account to sign in.</p>
                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <label>
                        Email
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>

                    <label>
                        Password
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>

                    <div className="login-actions">
                        <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
                        <button type="button" className="btn-ghost" onClick={() => navigate('/')}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
