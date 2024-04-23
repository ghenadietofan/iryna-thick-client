import React, {Component} from "react";
import axios from "axios";
import {Card, Form, Button} from "react-bootstrap";

export default class Cars extends Component {
    constructor(props) {
        super(props);

        this.carsList = this.carsList.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.getCreateButton = this.getCreateButton.bind(this);
        this.deleteCar = this.deleteCar.bind(this);

        this.state = {
            cars: []
        }

    }

    componentDidMount() {
        console.log(localStorage)
        if (!(localStorage.getItem("isLogined") === "true")) {
            window.location = '/auth';
            return;
        }

        axios.get("http://localhost:8888/api/v0/cars", {withCredentials: true})
            .then(res => {
                this.setState({
                    cars: res.data
                });
            })
            .catch(err => {
                window.location = '/auth'
            })
    }

    async deleteCar(carID) {
        if (localStorage.getItem("isLogined")) {
            console.log('Trying to delete the car...')
            try {
                await axios.delete(`/api/v0/cars/${carID}`).then(()=>{window.location.reload()})
            }catch (error){
                console.log('Error when Deleting:',error);
            }
        }
    }

    getButtons(carID) {
        if (localStorage.getItem("isLogined") ) {
            return (
                <div>
                    <Button variant="warning" onClick={() => {window.location = "/cars/update/" + carID}}>Update</Button>
                    <Button variant="danger" onClick={() => {this.deleteCar(carID)}}>Delete</Button>
                </div>
            )
        }
        return (
            <div>
                <Button variant="info" onClick={() => {window.location = "/cars/rent/" + carID}}>Rent</Button>
            </div>
        )

    }

    getCreateButton() {
        const style1 = {
            width: "100%",
            display:'flex',
            justifyContent:'center'
        }
        if (localStorage.getItem("isLogined") === "true") {
            return (
                <div style={style1}>
                <Button variant="success" style={{width:'150px',height:'34px;'}} onClick={() => {window.location = "/new/car"}}>+Create</Button>
                </div>
            )
        }
    }

    carsList() {
        if(this.state.cars.length>0){
        return this.state.cars.map(car => {
            return (
                <Card style={{ width: '40rem' }}>
                    <Card.Body>
                        <Card.Title>{car.brand}</Card.Title>
                        <Card.Text>{car.model}</Card.Text>
                        <p>{car.price} UAH per day</p>
                        <p>{car.number}</p>
                        {this.getButtons(car._id)}
                    </Card.Body>
                </Card>
            )
        })
        }else{
            return(
                <h2>There are no cars. Please, create a new car</h2>
            )
        }
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
                {this.getCreateButton()}
                {this.carsList()}
            </div>
        );
    }
}