import React, {Component} from "react";

export default class Profiles extends Component {
    componentDidMount() {
        if (!(localStorage.getItem("isLogined") === "true")) {
            window.location = '/auth';
        }
    }

    render () {
        return (
            <div>
                <p>You are on the Profiles component</p>
            </div>
        )
    }
}