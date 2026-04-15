import React from "react";
import { Redirect } from 'react-router-dom';
import '../assets/css/main.css';
import axios from "axios";
import tools from "../toolBox";
import getApiUrl from "../config";

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showSecret: false,
      redirected: false,
      token: "",
      mail: "",
      secret: "",
      role: "",
      isAdmin: false,
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
    axios.get(this.state.url + '/user', {
      headers: { 'token': this.state.token }
    }).then(response => {
      this.setState({
        mail: response.data.mail,
        secret: response.data.secret,
        role: response.data.role,
        isLoading: false
      });
    }).catch(error => {
      console.log(error);
      // Clear invalid cookie to avoid redirect loop (login ↔ index)
      document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      this.setState({ redirected: true });
    });
  }

  handleLogout = () => {
    document.cookie = "Token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    this.setState({ redirected: true });
  }

  promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));

  getInitial() {
    return this.state.mail ? this.state.mail[0].toUpperCase() : '?';
  }

  render() {
    if (this.state.redirected) return (<Redirect to="/login" />);
    if (this.state.isAdmin) return (<Redirect to="/admin" />);

    if (this.state.isLoading) return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <span>Chargement de votre profil…</span>
      </div>
    );

    return (
      <div className="page-full">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-brand">
            <div className="navbar-logo">🏕️</div>
            40e de Bierges
          </div>
          <div className="navbar-nav">
            <span className="nav-link active">Mon profil</span>
            <a href="/blog" className="nav-link">Forum</a>
            <button className="btn btn-danger btn-ghost" onClick={this.handleLogout} style={{fontSize:'0.85rem',padding:'0.4rem 0.9rem'}}>
              Déconnexion
            </button>
          </div>
        </nav>

        {/* Page content */}
        <div className="page-wrapper" style={{flex:1}}>
          <div className="card card-md animate-in welcome-card">

            {/* User avatar + info */}
            <div className="user-avatar-lg">{this.getInitial()}</div>

            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 style={{marginBottom:'0.2rem'}}>Bonjour 👋</h1>
                <p style={{fontSize:'1rem', color:'var(--text-secondary)'}}>{this.state.mail}</p>
              </div>
              <span className={`badge ${this.state.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                {this.state.role === 'admin' ? '⚡ Admin' : '👤 Membre'}
              </span>
            </div>

            <div className="divider"></div>

            {/* Secret section */}
            <div>
              <h3>🔐 Votre secret personnel</h3>
              <div className={`secret-box ${this.state.showSecret ? '' : 'secret-hidden'}`}>
                {this.state.showSecret ? this.state.secret : '••••••••••••••••••••••••••••••••••••'}
              </div>
              <button
                id="btn-toggle-secret"
                className="btn btn-secondary"
                onClick={this.toggleSecret}
              >
                {this.state.showSecret ? '🙈 Masquer le secret' : '👁️ Révéler mon secret'}
              </button>
            </div>

            <div className="divider"></div>

            {/* Quick links */}
            <div>
              <h3>Navigation rapide</h3>
              <div className="flex gap-1">
                <a href="/blog" className="btn btn-secondary" style={{flex:1, textAlign:'center'}}>
                  💬 Aller au Forum
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Index;
