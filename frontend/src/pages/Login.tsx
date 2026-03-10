import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { LOGIN_MUTATION } from '../graphql/mutations';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data: any) => {
            localStorage.setItem('token', data.login.token);
            window.location.href = '/';
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ variables: { email, password } });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 16px' }}>

            <div style={{ marginBottom: '32px' }}>
                <img src="/logo-full.png" alt="Financy Logo" style={{ height: '32px' }} />
            </div>

            <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '420px', padding: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Fazer login</h1>
                    <p className="auth-subtitle">Entre na sua conta para continuar</p>
                </div>

                <form onSubmit={handleSubmit}>
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

                    <div className="input-group">
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

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 24px', fontSize: '0.875rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <input type="checkbox" style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px', borderRadius: '4px', border: '1px solid var(--border-color)', margin: 0 }} />
                            Lembrar-me
                        </label>
                        <a href="#" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Recuperar senha</a>
                    </div>

                    {error && <div style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '16px', textAlign: 'center' }}>{error.message}</div>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="auth-divider">ou</div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>Ainda não tem uma conta?</p>
                    <Link to="/register" className="btn btn-secondary" style={{ width: '100%' }}>
                        <UserPlus size={18} />
                        Criar conta
                    </Link>
                </div>
            </div>
        </div>
    );
}
