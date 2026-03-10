import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, LogIn } from 'lucide-react';
import { REGISTER_MUTATION } from '../graphql/mutations';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [register, { loading, error }] = useMutation(REGISTER_MUTATION, {
        onCompleted: (data: any) => {
            localStorage.setItem('token', data.register.token);
            window.location.href = '/';
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Note: Our current backend schema only expects email and password
            await register({ variables: { email, password } });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', minHeight: '100vh', padding: '40px 16px' }}>

            <div style={{ marginBottom: '32px' }}>
                <img src="/logo-full.png" alt="Financy Logo" style={{ height: '32px' }} />
            </div>

            <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '420px', padding: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Criar conta</h1>
                    <p className="auth-subtitle">Comece a controlar suas finanças ainda hoje</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="name">Nome completo</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon-left" />
                            <input
                                id="name"
                                type="text"
                                className="input-field input-field-with-icon-left"
                                placeholder="Seu nome completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="email">E-mail</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon-left" />
                            <input
                                id="email"
                                type="email"
                                className="input-field input-field-with-icon-left"
                                placeholder="mail@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: '8px' }}>
                        <label className="input-label" htmlFor="password">Senha</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon-left" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="input-field input-field-with-icon-left input-field-with-icon-right"
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                className="input-icon-right"
                                aria-label="Toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '24px' }}>A senha deve ter no mínimo 8 caracteres</p>

                    {error && <div style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '16px', textAlign: 'center' }}>{error.message}</div>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <div className="auth-divider">ou</div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>Já tem uma conta?</p>
                    <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>
                        <LogIn size={18} />
                        Fazer login
                    </Link>
                </div>
            </div>
        </div>
    );
}
