import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';

import LoginForm from './components/Forms/LoginForm';
import SignUpForm from './components/Forms/SignUpForm';
import ProfileChangeForm from './components/Forms/ProfileChangeForm';
import HomePage from './components/HomePage';

const App = () => {

    const [ user, setUser ] = useState({});

    // Inital Render
    useEffect( () => {
        const loggedInUser = window.localStorage.getItem("Authorization");
        if (loggedInUser) {
            setUser({ Authorization: loggedInUser});
        }
    }, []);

    // On User State Update
    useEffect( () => {
        // If user is currently logged in but their data isn't retrieved, retrieve data
        if (user.Authorization && !user._id) {
            get_user();
        }
    }, [user]);

    const get_user = async () => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_API_URL+"user/me", {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setUser({...data, Authorization: user.Authorization});
        } catch (err) {
            console.log(err);
        }
    };

    return(
        <Container>
            <Router>
                <Routes>
                    <Route 
                        exact path="/"
                        element= {
                            !user.Authorization ? 
                                <Navigate to="/login"/>
                                :
                                <HomePage
                                    user={user}
                                    setUser={setUser}
                                />
                        }
                    />
                    <Route 
                        path={"/login"}
                        element={<LoginForm
                            user={user}
                            setUser={setUser}
                        />} 
                    />
                    <Route 
                        path={"/signup"}
                        element={<SignUpForm
                            user={user}
                            setUser={setUser}
                        />}
                    />
                    <Route 
                        path={"/profile"}
                        element={
                            !user.Authorization ? 
                                <Navigate to="/login"/>
                                :
                                <ProfileChangeForm
                                    user={user}
                                    setUser={setUser}
                                />
                        }
                    />
                </Routes>
            </Router>
        </Container>
    );
};

export default App;