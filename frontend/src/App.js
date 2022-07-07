import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';

import LoginForm from './components/Forms/LoginForm';
import SignUpForm from './components/Forms/SignUpForm';
import ProfileChangeForm from './components/Forms/ProfileChangeForm';
import HomePage from './components/HomePage';


const App = () => {

    const [ user, setUser ] = useState({});
    const [ loggedIn, setLoggedIn ] = useState(false);

    useEffect( () => {
        if (loggedIn) {
            if (user.Authorization) get_user(user.Authorization);
        } else {
            if (check_if_existing_user()) {
                get_user(window.localStorage.getItem('Authorization'));
            }
        }
    }, [loggedIn]);

    // useEffect( () => {
    //     if (user.Authorization) console.log(user.Authorization);
    //     if (user._id) console.log(user._id);
    // }, [user]);

    const check_if_existing_user = () => {
        const loggedInUser = window.localStorage.getItem('Authorization');
        if (loggedInUser) {
            setLoggedIn(true);
            return true;
        } else {
            setLoggedIn(false);
            return false;
        }
    }

    const get_user = async (token) => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_API_URL+"user/me", {
                headers: {
                    Authorization: token
                }
            });
            setUser({...data, Authorization: token});
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
                        element={<HomePage
                            user={user}
                            setUser={setUser}
                            setLoggedIn={setLoggedIn}
                            check_if_existing_user={check_if_existing_user}
                        />}
                    />
                    <Route 
                        path="/login" 
                        element={<LoginForm 
                            setLoggedIn={setLoggedIn} 
                            setUser={setUser} 
                            check_if_existing_user={check_if_existing_user}
                        />} 
                    />
                    <Route 
                        path="/signup" 
                        element={<SignUpForm 
                            setLoggedIn={setLoggedIn} 
                            setUser={setUser} 
                            check_if_existing_user={check_if_existing_user}
                        />}
                    />
                    <Route 
                        path="/profile" 
                        element={<ProfileChangeForm
                            user={user}
                            setLoggedIn={setLoggedIn}
                            check_if_existing_user={check_if_existing_user}
                        />}
                    />
                    <Route
                        path="/tiktok"
                        element={
                            <Container style={{
                                left: 0,
                                width: "100%",
                                height: 500,
                                position: "relative"
                            }}>
                                <iframe
                                    style={{
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        position: "absolute",
                                        border: 0
                                    }}
                                    src="https://www.tiktok.com/embed/7110361906304535850"
                                    title="7110361906304535850"
                                    allowFullScreen
                                    scrolling="no"
                                    allow="encrypted-media;"
                                ></iframe>
                            </Container>
                        }
                    />
                </Routes>
            </Router>
        </Container>
    );
};

export default App;