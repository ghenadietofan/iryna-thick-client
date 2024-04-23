import React, {Component} from "react";
import axios from "axios";
import {Card, Form, Button} from "react-bootstrap";

export default class CreateCar extends Component {
    constructor(props) {
        super(props);

        this.carPrint = this.carPrint.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeBrand = this.onChangeBrand.bind(this);
        this.onChangeModel = this.onChangeModel.bind(this);
        this.onChangeNumber = this.onChangeNumber.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeImg = this.onChangeImg.bind(this);

        this.state = {
            carID: "",
            brand: "",
            model: "",
            number: "",
            price: 0,
            img: ""
        }

    }

    onChangeBrand(e) {
        this.setState({
            brand: e.target.value
        })
    }

    onChangeModel(e) {
        this.setState({
            model: e.target.value
        })
    }

    onChangeNumber(e) {
        this.setState({
            number: e.target.value
        })
    }

    onChangePrice(e) {
        this.setState({
            price: e.target.value
        })
    }

    onChangeImg(e) {
        this.setState({
            img: e.target.value
        })
    }

    componentDidMount() {
        if (!(localStorage.getItem("isLogined") === "true")) {
            window.location = '/auth';
            return;
        }
    }

    onSubmit(e) {
        e.preventDefault();

        let data = {
            brand: this.state.brand,
            model: this.state.model,
            number: this.state.number,
            price: Number(this.state.price),
            img: this.state.img
        };
        axios.post('/api/v0/cars', data, {withCredentials: true})
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

    carPrint() {
        return (
            <Card style={{ width: '40rem' }}>
                <Card.Body>
                    <Card.Title>Create new car</Card.Title>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type="text" value={this.state.brand} onChange={this.onChangeBrand} placeholder="Brand" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Model</Form.Label>
                            <Form.Control type="text" value={this.state.model} onChange={this.onChangeModel} placeholder="Model" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Number</Form.Label>
                            <Form.Control type="text" value={this.state.number} onChange={this.onChangeNumber} placeholder="Number" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" value={this.state.price} onChange={this.onChangePrice} placeholder="Price" />
                        </Form.Group>
                        <Button variant="success" type="submit">
                            Create
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
                {this.carPrint()}
            </div>
        );
    }
}