import React, {Component} from "react";
import {Link} from 'react-router-dom';
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default class Navbar extends Component {
    constructor(params) {
        super(params);

        this.LeftButton = this.LeftButton.bind(this);
        this.LogOut = this.LogOut.bind(this);

        this.state = {
            isLogined: ""
        }
    }

    componentDidMount() {
        this.setState({
            isLogined: localStorage.getItem('isLogined')
        })
    }

    LeftButton() {
        if (this.state.isLogined === 'true') {
            return (
                <Form className="d-flex">
                    <Button variant="outline-success" onClick={this.LogOut}>Log out</Button>
                </Form>
            )
        } else {
            return (
                <Form className="d-flex">
                    <Button variant="outline-success" onClick={() => {window.location = '/auth'}}>Log in</Button>
                </Form>
            )
        }
    }

    LogOut() {
        axios.get("http://localhost:8888/api/v0/auth/logout", {withCredentials: true})
            .then(res => {
                localStorage.removeItem("userRole");
                localStorage.removeItem("userID");
                localStorage.removeItem("isLogined");
                document.cookie = "";
                this.setState({
                    isLogined: false
                })
                window.location = '/';
            })
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg bg-light">
                <Link to='/' className="navbar-brand">App</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        <li className="navbar-item">
                            <Link to="/cars" className="nav-link">Cars</Link>
                        </li>
                        {/*<li className="nav-item">*/}
                        {/*    <Link to="/orders" className="nav-link">Orders</Link>*/}
                        {/*</li>*/}
                        {/*<li className="nav-item">*/}
                        {/*    <Link to="/user" className="nav-link">Profile</Link>*/}
                        {/*</li>*/}
                    </ul>
                </div>
                {this.LeftButton()}
            </nav>
        );
    }
}