import React, {Component} from "react";
import axios from "axios";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Card} from "react-bootstrap";

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            firstName: "",
            lastName: "",
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

    onChangeFirstName(e) {
        this.setState({
            firstName: e.target.value
        });
    }

    onChangeLastName(e) {
        this.setState({
            lastName: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        let data = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password
        };
        axios.post('/api/v0/auth/register', data, {withCredentials: true})
            .then(res => {
                if (res.status === 200) {
                    window.location = '/auth';
                }
            })
            .catch(err => {
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
                        <Card.Title>Sign up</Card.Title>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>First name</Form.Label>
                                <Form.Control type="firstName" value={this.state.firstName} onChange={this.onChangeFirstName} placeholder="Enter you name" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control type="lastName" value={this.state.lastName} onChange={this.onChangeLastName} placeholder="Enter you last name" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" value={this.state.email} onChange={this.onChangeEmail} placeholder="Enter email" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" value={this.state.password} onChange={this.onChangePassword} placeholder="Password" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Sign up
                            </Button>
                        </Form>
                        <br/>
                        <br/>
                        <p>Do you have an account?</p>
                        <Button variant="warning" onClick={() => {window.location = "/auth"}}>
                            Log in
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }

}