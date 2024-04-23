import React, {Component} from "react";
import axios from "axios";

class Orders extends Component{
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            role: "",
            userID: ""
        };
    }

    componentDidMount() {
        if (!(localStorage.getItem("isLogined") === "true")) {
            window.location = '/auth';
            return;
        }

        const userID = localStorage.getItem("userID")

        this.setState({
            role: localStorage.getItem("userRole"),
            userID: userID
        })

        axios.get('http://localhost:8888/spec/' + userID, {withCredentials: true})
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        firstName: res.data.first_name,
                        lastName: res.data.last_name
                    })
                }
            })
            .catch(err => {
                console.log(err)
                alert("Something went wrong. Cannot get your name.");
            })
    }

    render() {
        return (
            <div>
                <p>You are on the Orders component</p>
                <p>You are {this.state.firstName} {this.state.lastName}</p>
            </div>
        );
    }
}

export default Orders;