import React, {Component} from "react";
import axios from "axios";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Card} from "react-bootstrap";

export default class Auth extends Component {
    constructor(props) {
        super(props);

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            email: "",
            password: ""
        }
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        let data = {email: this.state.email, password: this.state.password};
        axios.post('/api/v0/auth/login', data, {withCredentials: true})
            .then(res => {
                console.log(res.status);
                let d = new Date();
                d.setTime(d.getTime() + (60*60*1000));
                localStorage.setItem('userRole', res.data.role);
                localStorage.setItem('userID', res.data.id);
                localStorage.setItem('isLogined', "true");
                window.location = "/";
            })
            .catch(err => {
                console.log(err.response.status);
                alert("Something went wrong. Try again.");
            })
    }
    render() {
        const toCenter = {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }
        return (
            <div style={toCenter}>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>Log in</Card.Title>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" value={this.state.email} onChange={this.onChangeEmail} placeholder="Enter email" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" value={this.state.password} onChange={this.onChangePassword} placeholder="Password" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Log in
                            </Button>
                        </Form>
                        <br/>
                        <br/>
                        <p>Don't you have an account?</p>
                        <Button variant="warning" onClick={() => {window.location = "/register"}}>
                            Sigh up
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }

}