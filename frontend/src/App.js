import React from 'react';

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar.component";
import HomePage from "./components/home-page.component";
import Cars from "./components/cars.component";
import Orders from "./components/orders.component";
import Profiles from "./components/profiles.component";
import Auth from "./components/auth.component";
import Register from "./components/register.component";
import UpdateCar from "./components/cars-update.component";
import CreateCar from "./components/cars-create.component";
import RentCar from "./components/cars-rent.component";

function App() {
  return (
      <Router>
          <div className="container">
            <Navbar />
            <br/>
              <Routes>
                <Route path="/" exact element={<HomePage />} />
                <Route path="/cars" element={<Cars />} />
                <Route path="/new/car" element={<CreateCar />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/user" element={<Profiles />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cars/update/:id" element={<UpdateCar />} />
                <Route path="/cars/rent/:id" element={<RentCar />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
