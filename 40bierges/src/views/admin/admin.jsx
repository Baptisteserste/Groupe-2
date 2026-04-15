import React from "react";
import { Redirect } from 'react-router-dom';
import '../../assets/css/main.css';
import axios from "axios";
import tools from "../../toolBox";

class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showSecret: false,
            redirected: false,
            token: "",
            userList: [],
            isLoading: true,
            url: getApiUrl()
        };
        this.toggleSecret = this.toggleSecret.bind(this);
    }

    componentDidMount() {
        if (tools.checkIfConnected()) {
            this.promisedSetState({ token: tools.readCookie("Token") }).then(() => {
                this.fetchData();
            });
        } else {
            this.setState({ redirected: true });
        }
    }

    toggleSecret() {
        this.setState({ showSecret: !this.state.showSecret });
    }

    fetchData() {
        axios.get(this.state.url + '/admin', {
            headers: { 'token': this.state.token }
        }).then(response => {
            if (response.status === 200) {
                this.setState({ userList: response.data, isLoading: false });
            } else {
                this.setState({ redirected: true });
            }
        }).catch(error => {
            this.setState({ redirected: true });
            console.log(error);
        });
    }

    handleLogout = () => {
        document.cookie = "Token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
        this.setState({ redirected: true });
    }

    promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));

    getAdminUser() {
        return this.state.userList.find(u => u.role === 'admin');
    }

    getUserList() {
        return this.state.userList.filter(u => u.role === 'user');
    }

    render() {
        if (this.state.redirected) return (<Redirect to="/login" />);

        if (this.state.isLoading) return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <span>Chargement du tableau de bord…</span>
            </div>
        );

        const admin = this.getAdminUser();
        const users = this.getUserList();

        return (
            <div className="page-full">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-brand">
                        <div className="navbar-logo">🏕️</div>
                        40e de Bierges
                    </div>
                    <div className="navbar-nav">
                        <span className="badge badge-admin">⚡ Admin</span>
                        <a href="/blog" className="nav-link">Forum</a>
                        <button className="btn btn-danger btn-ghost" onClick={this.handleLogout} style={{fontSize:'0.85rem',padding:'0.4rem 0.9rem'}}>
                            Déconnexion
                        </button>
                    </div>
                </nav>

                {/* Dashboard content */}
                <div className="page-wrapper" style={{flex:1, alignItems:'flex-start'}}>
                    <div className="card card-lg animate-in">

                        <h1 style={{marginBottom:'0.5rem'}}>⚡ Tableau de bord Admin</h1>
                        <p className="subtitle">Bienvenu, vous avez accès à l'ensemble des données de la plateforme.</p>

                        {/* Stats */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-value">{this.state.userList.length}</div>
                                <div className="stat-label">Utilisateurs</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{users.length}</div>
                                <div className="stat-label">Membres</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">1</div>
                                <div className="stat-label">Admin</div>
                            </div>
                        </div>

                        {/* Admin secret */}
                        {admin && (
                            <div className="mb-3">
                                <h3>🔐 Votre secret admin</h3>
                                <div className={`secret-box ${this.state.showSecret ? '' : 'secret-hidden'}`}>
                                    {this.state.showSecret ? admin.secret : '••••••••••••••••••••••••••••••••••••'}
                                </div>
                                <button
                                    id="btn-toggle-admin-secret"
                                    className="btn btn-secondary"
                                    onClick={this.toggleSecret}
                                >
                                    {this.state.showSecret ? '🙈 Masquer' : '👁️ Révéler le secret admin'}
                                </button>
                            </div>
                        )}

                        <div className="divider"></div>

                        {/* User table */}
                        <h3>👥 Secrets de tous les membres</h3>
                        <div style={{overflowX:'auto'}}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>E-mail</th>
                                        <th>Rôle</th>
                                        <th>Secret</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.userList.map((user, index) => (
                                        <tr key={index}>
                                            <td style={{color:'var(--text-muted)', fontFamily:'Fira Code, monospace', fontSize:'0.8rem'}}>
                                                {user.id}
                                            </td>
                                            <td style={{fontWeight:'500', color:'var(--text-primary)'}}>
                                                {user.mail}
                                            </td>
                                            <td>
                                                <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                                                    {user.role === 'admin' ? '⚡ Admin' : '👤 Membre'}
                                                </span>
                                            </td>
                                            <td style={{fontFamily:'Fira Code, monospace', fontSize:'0.82rem', color:'var(--success)'}}>
                                                {user.secret}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default Admin;