import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';

import DEFAULT from './Images/DEFAULT.jpg';

const DaysOfTheWeek = {
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
    7: "Saturday"
};

const HomePage = ({ user, setUser, setLoggedIn, check_if_existing_user }) => {
    const navigate = useNavigate();

    const [ avatar, setAvatar ] = useState("");
    const [ todaysWorkout, setTodaysWorkout ] = useState({});

    const [ profileUpdate, setProfileUpdate ] = useState(false);
    const [ logout, setLogout ] = useState(false);

    // // On Change to Use State
    useEffect( () => {

        // if (!check_if_existing_user()) {
        //     console.log("NO USER");
        //     navigate('/login', { replace: true});
        // }

        if (user._id && avatar === "") setAvatar(process.env.REACT_APP_API_URL+`user/me/avatar/${user._id}` || DEFAULT);
            
        // On Change to the User State update today's Workout if exists
        if (user.schedule) {
            const today = new Date();
            user.schedule.workouts.forEach( workout => {
                if (workout.dayOfTheWeek === DaysOfTheWeek[today.getDay()]) {
                    setTodaysWorkout(workout);
                }
            });
        }
    }, [user]);

    useEffect( () => {
        if (profileUpdate) navigate('/profile', { replace: true});
    }, [profileUpdate]);

    useEffect( () => {
        if (logout) {
            window.localStorage.removeItem('Authorization');
            handle_logout();
            navigate('/login', { replace: true});
        }
    }, [logout])

    // Logs User out and delete's authentication token from database through POST request
    const handle_logout = async () => {
        try {
            await axios.post(process.env.REACT_APP_API_URL+"user/logout", {}, {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setUser({});
            setLoggedIn(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Image src={avatar} thumbnail />
                </Col>
                <Col>
                    <h1>Today's Workout</h1>
                    { todaysWorkout.name ?
                        <>
                            <h3>{todaysWorkout.name}</h3>
                            <Button variant='outline-success'>Complete</Button>
                            <Button variant='outline-danger'>Rest Day</Button>
                        </>
                        :
                        <h3>Rest Day</h3>
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    { user ?
                        <>
                            <h5>Name: {user.name}</h5>
                            <h5>Age: {user.age}</h5>
                            <h5>Weight: {user.weight}</h5>
                            <h5>Height: {user.height}</h5>
                        </>
                        : <></>
                    }
                    <Button variant="outline-primary" onClick={ e=> { e.preventDefault(); setProfileUpdate(true);}}>Update Profile</Button>
                    {" "}
                    <Button variant="outline-warning" onClick={ e => { e.preventDefault(); setLogout(true); }}>Logout</Button>
                </Col>
                <Col>
                    <h1>Schedule and Progress</h1>
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;