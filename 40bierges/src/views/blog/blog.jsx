import React from "react";
import { Redirect } from 'react-router-dom';
import '../../assets/css/main.css';
import tools from "../../toolBox";
import axios from "axios";
import getApiUrl from "../../config";

class Blog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirected: false,
      newMessage: "",
      messages: [],
      token: "",
      isLoading: true,
      isSending: false,
      url: getApiUrl()
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
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

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSend() {
    if (!this.state.newMessage.trim()) return;
    this.setState({ isSending: true });
    axios.post(this.state.url + '/blog', {
      message: this.state.newMessage
    }, {
      headers: { 'token': this.state.token }
    }).then(response => {
      if (response.status === 200) {
        // ⚠️ FAILLE XSS: le message est ajouté tel quel, sans sanitisation
        let tmp = [...this.state.messages, this.state.newMessage];
        this.setState({ messages: tmp, newMessage: "", isSending: false });
      }
    }).catch(error => {
      console.log(error);
      this.setState({ isSending: false });
    });
  }

  handleLogout = () => {
    document.cookie = "Token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    this.setState({ redirected: true });
  }

  promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));

  fetchData() {
    axios.get(this.state.url + '/blog', {
      headers: { 'token': this.state.token }
    }).then(response => {
      this.setState({ messages: response.data, isLoading: false });
    }).catch(error => {
      console.log(error);
      this.setState({ isLoading: false });
    });
  }

  getInitial(index) {
    return String.fromCharCode(65 + (index % 26));
  }

  render() {
    if (this.state.redirected) return (<Redirect to="/login" />);

    if (this.state.isLoading) return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <span>Chargement du forum…</span>
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
            <a href="/index" className="nav-link">Mon profil</a>
            <span className="nav-link active">Forum</span>
            <button className="btn btn-danger btn-ghost" onClick={this.handleLogout} style={{fontSize:'0.85rem',padding:'0.4rem 0.9rem'}}>
              Déconnexion
            </button>
          </div>
        </nav>

        {/* Content */}
        <div className="blog-content">

          {/* Messages Feed */}
          <div>
            <h2 style={{marginBottom:'1.25rem'}}>
              💬 Forum de la communauté
              <span className="badge badge-success" style={{marginLeft:'0.75rem', verticalAlign:'middle'}}>
                {this.state.messages.length} message{this.state.messages.length !== 1 ? 's' : ''}
              </span>
            </h2>

            {this.state.messages.length === 0 ? (
              <div className="card" style={{textAlign:'center', padding:'3rem', color:'var(--text-muted)'}}>
                <div style={{fontSize:'2.5rem', marginBottom:'0.75rem'}}>📭</div>
                <p>Aucun message pour l'instant. Soyez le premier !</p>
              </div>
            ) : (
              <div className="blog-feed">
                {this.state.messages.map((message, index) => (
                  <div className="message-card" key={index}>
                    <div className="message-meta">
                      <div className="message-avatar">{this.getInitial(index)}</div>
                      <div>
                        <div className="message-author">Anonyme #{index + 1}</div>
                      </div>
                      <div className="message-time">#{index + 1}</div>
                    </div>
                    {/* ============================================================ */}
                    {/* 🔴 FAILLE XSS STOCKÉE : dangerouslySetInnerHTML utilisé ICI  */}
                    {/* Le contenu HTML posté par les utilisateurs est rendu tel quel */}
                    {/* ============================================================ */}
                    <div
                      className="message-body"
                      dangerouslySetInnerHTML={{ __html: message }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compose Panel */}
          <div className="compose-panel">
            <div className="card">
              <h3>✍️ Nouveau message</h3>
              <div className="form-group">
                <textarea
                  id="blog-message"
                  className="form-input"
                  name="newMessage"
                  value={this.state.newMessage}
                  onChange={this.handleChange}
                  placeholder="Écrivez votre message ici…"
                  style={{minHeight:'140px'}}
                />
              </div>
              <button
                id="btn-post-message"
                className="btn btn-primary"
                onClick={this.handleSend}
                disabled={this.state.isSending || !this.state.newMessage.trim()}
              >
                {this.state.isSending ? (
                  <><span className="spinner" style={{width:'14px',height:'14px',borderWidth:'2px'}}></span> Envoi…</>
                ) : '📨 Publier'}
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default Blog;