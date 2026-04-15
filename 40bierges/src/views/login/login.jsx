import React from "react";
import { Redirect } from 'react-router-dom';
import '../../assets/css/main.css';
import tools from "../../toolBox";
import axios from "axios";
import getApiUrl from "../../config";

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirected: false,
      redirectedAdmin: false,
      mail: "",
      password: "",
      error: "",
      isLoading: false,
      url: getApiUrl()
    };
    this.handleConnect = this.handleConnect.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (tools.checkIfConnected()) {
      this.setState({ redirected: true });
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value, error: "" });
  }

  handleConnect() {
    if (this.state.mail === '' || this.state.password === '') {
      this.setState({ error: 'Veuillez remplir tous les champs.' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(this.state.mail)) {
      this.setState({ error: "L'adresse e-mail n'est pas valide." });
      return;
    }
    this.setState({ isLoading: true, error: "" });
    axios.post(this.state.url + '/connection', {
      mail: this.state.mail,
      password: this.state.password
    }).then(response => {
      if (response.status === 200) {
        let d = new Date();
        d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = "Token=" + response.data.token + ";" + expires + ";path=/";
        if (response.data.role === "user") {
          this.setState({ redirected: true });
        } else if (response.data.role === "admin") {
          this.setState({ redirectedAdmin: true });
        }
      }
    }).catch(error => {
      const msg = error.response
        ? (error.response.status === 403 ? "Identifiants invalides." : error.response.data)
        : "Impossible de contacter le serveur.";
      this.setState({ error: msg, isLoading: false });
    });
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') this.handleConnect();
  }

  render() {
    if (this.state.redirected) return (<Redirect to="/index" />);
    if (this.state.redirectedAdmin) return (<Redirect to="/admin" />);

    return (
      <div className="page-wrapper">
        <div className="card card-sm animate-in">

          {/* Brand */}
          <div className="brand">
            <div className="brand-icon">🏕️</div>
            <div className="brand-name">40e de Bierges</div>
          </div>

          <h1>Connexion</h1>
          <p className="subtitle">Accédez à votre espace personnel.</p>

          {/* Error */}
          {this.state.error && (
            <div className="alert alert-error">
              ⚠️ {this.state.error}
            </div>
          )}

          {/* Form */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-mail">Adresse e-mail</label>
            <input
              id="login-mail"
              className="form-input"
              type="email"
              name="mail"
              value={this.state.mail}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              placeholder="vous@exemple.com"
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Mot de passe</label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            id="btn-login"
            className="btn btn-primary mt-2"
            onClick={this.handleConnect}
            disabled={this.state.isLoading}
          >
            {this.state.isLoading ? (
              <><span className="spinner" style={{width:'16px',height:'16px',borderWidth:'2px'}}></span> Connexion…</>
            ) : (
              <>→ Se connecter</>
            )}
          </button>

        </div>
      </div>
    );
  }
}

export default Login;
