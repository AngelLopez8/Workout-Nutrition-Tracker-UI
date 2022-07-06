import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginForm from './components/Forms/LoginForm';
import SignUpForm from './components/Forms/SignUpForm';
import ProfileChangeForm from './components/Forms/ProfileChangeForm';
import HomePage from './components/HomePage';


const App = () => {

    return(
        <Container>
            <Router>
                <Routes>
                    <Route exact path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignUpForm />}/>
                    <Route path="/profile" element={<ProfileChangeForm/>}/>
                </Routes>
            </Router>
        </Container>
    );
};

export default App;