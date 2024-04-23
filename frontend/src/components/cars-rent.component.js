import React, {Component} from "react";
import axios from "axios";
import {Card, Form, Button} from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class RentCar extends Component {
    constructor(props) {
        super(props);

        this.rentPrint = this.rentPrint.bind(this);
        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            carID: "",
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now()),
            totalPrice: 0,
            carPrice: 0
        }

    }

    componentDidMount() {
        if (!(localStorage.getItem("isLogined") === "true")) {
            window.location = '/auth';
            return;
        }

        let carID = window.location.href.slice(window.location.href.lastIndexOf("/")+1)
        this.setState({carID: carID})

        axios.get("http://localhost:8888/api/v0/cars/" + carID, {withCredentials: true})
            .then(res => {
                this.setState({
                    carPrice: res.data.price
                })
            })
    }

    onChangeStartDate(e) {
        let possiblePrice = Math.ceil(new Date(this.state.endDate.getTime() - new Date(e.target.value).getTime()) / (1000 * 60 * 60 * 24)) * this.state.carPrice

        if(isNaN(possiblePrice) || possiblePrice < 0){
            possiblePrice = "Некоректні дати оренди автомобіля!"
        }

        this.setState({
            startDate: new Date(e.target.value),
            totalPrice: possiblePrice
        })
    }
    onChangeEndDate(e) {
        let possiblePrice = Math.ceil(new Date(new Date(e.target.value).getTime() - this.state.startDate.getTime()) / (1000 * 60 * 60 * 24)) * this.state.carPrice

        if(isNaN(possiblePrice) || possiblePrice < 0){
            possiblePrice = "Некоректні дати оренди автомобіля!"
        }

        this.setState({
            endDate: new Date(e.target.value),
            totalPrice: possiblePrice
        })
    }

    onSubmit(e) {
        e.preventDefault();

        let data = {
            carId: this.state.carID,
            startDate: this.state.startDate,
            endDate: this.state.endDate
        };
        axios.post('/api/v0/rents', data, {withCredentials: true})
            .then(res => {
                if (res.status === 200) {
                    window.location = '/cars';
                }
            })
            .catch(err => {
                alert("Something went wrong. Try again.");
                window.location = '/cars';
            })
    }

    rentPrint() {
        return (
            <Card style={{ width: '40rem' }}>
                <Card.Body>
                    <Card.Title>Rent a car</Card.Title>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Start date</Form.Label>
                            <Form.Control type="date" defaultValue={this.state.startDate.toDateString()} onChange={this.onChangeStartDate} placeholder="Start date" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>End date</Form.Label>
                            <Form.Control type="date" defaultValue={this.state.endDate} onChange={this.onChangeEndDate} placeholder="End date" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Total price: {this.state.totalPrice}</Form.Label>
                        </Form.Group>
                        <Button variant="success" type="submit">
                            Rent!
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        )
    }

    render () {
        const toCenter = {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }
        return (
            <div style={toCenter}>
                {this.rentPrint()}
            </div>
        );
    }
}