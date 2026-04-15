import React from "react";
import { Redirect } from 'react-router-dom'

// core components
import '../../assets/css/main.css'
import axios from "axios";
import tools from "../../toolBox"

import ButtonUser from "../../components/ButtonUser";

class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showSecret: false,
            redirected: false,
            token: "",
            userList: "",
            isLoading: true,
            url: "http://localhost:3001"
        };
        this.toggleSecret = this.toggleSecret.bind(this)
    };

    componentDidMount() {
        if (tools.checkIfConnected()) {
            this.promisedSetState({ token: tools.readCookie("Token") }).then(result => {
                this.fetchData()
            })
        } else {
            this.setState({ redirected: true })
        }
    }

    toggleSecret() {
        this.setState({ showSecret: !this.state.showSecret })
    }

    fetchData() {
        axios.get(this.state.url + '/admin', {
            headers: {
                'token': this.state.token
            }
        }).then(response => {
            if (response.status === 200) {
                this.setState({
                    userList: response.data,
                    isLoading: false
                })
            } else {
                this.setState({
                    redirected: true
                })
            }
        }).catch(error => {
            this.setState({
                redirected: true
            })
            console.log(error)
        });
    }

    // Ajout de la fonction de déconnexion
    // On efface le cookie en le mmodifiant avec une date expirée et on reset le state
  handleDisconnect = () => {
    document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    this.setState({ redirected: true });
  }

    promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));

    render() {
        if (this.state.redirected) return (<Redirect to="/login" />)
        if (this.state.isLoading) return (<p>Please wait...</p>);
        return (
            <>
                <div>
                    Bienvenu sur votre page ultime cher Admin !
                    <ButtonUser handleClick={this.toggleSecret} />
                    {this.state.showSecret ? <div>{this.state.userList[0].secret}</div> : <div>***************</div>}
                </div>
                <div>
                    En tant qu'administrateur, voici également la liste des secrets de tous les utilisateurs inscrits :
                    {this.state.userList.map((user, index) => {
                        if (user.role === "user") {
                            return (
                                <div key={index}>
                                    <p>{user.mail} : {user.secret}</p>
                                </div>
                            )
                        } 
                        // added empty return (arrow function expects a return)
                        else {
                            return (<div> </div>)
                        }
                    })}
                    {/* Bouton de déconnexion */}
                    <button onClick={this.handleDisconnect}>Se déconnecter</button>
                </div>
            </>
        );
    }
}

export default Admin;