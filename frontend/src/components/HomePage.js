import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';

import WorkoutForm from './Forms/WorkoutForm';

import DEFAULT from './Images/DEFAULT.jpg';

const DaysOfTheWeek = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
};

const HomePage = () => {
    const navigate = useNavigate();

    const [ user, setUser ] = useState({});
    const [ avatar, setAvatar ] = useState("");
    const [ todaysWorkout, setTodaysWorkout ] = useState({});

    const [ createForm, setCreateForm ] = useState(false);
    const [ profileUpdate, setProfileUpdate ] = useState(false);
    const [ logout, setLogout ] = useState(false);

    /**
     * Initial Render checks for logged in user.
     * If user is logged in proceed to render information
     * else redirect user to login page
     */
    useEffect( () => {
        const loggedInUser = window.localStorage.getItem('user');
        if (loggedInUser) {
            const data = JSON.parse(loggedInUser);
            get_user(data.Authorization);
        } else {
            navigate('/login', { replace: true});
        }
    }, []);

    // On Change to Use State
    useEffect( () => {
        // On Change to the User State set the avatar if it exists
        if (user.Authorization) {
            if (avatar === "") handleAvatar();
        }
        
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
            window.localStorage.removeItem('user');
            handle_logout();
            navigate('/login', { replace: true});
        }
    }, [logout])

    // Retrieves User Information with proper authentication through GET request
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

    // Logs User out and delete's authentication token from database through POST request
    const handle_logout = async () => {
        try {
            await axios.post(process.env.REACT_APP_API_URL+"user/logout", {}, {
                headers: {
                    Authorization: user.Authorization
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    // Retrieves User Avatar with proper authentication through GET request
    const handleAvatar = async () => {
        try {
            await axios.get(process.env.REACT_APP_API_URL+`user/me/avatar/${user._id}`);
            setAvatar(process.env.REACT_APP_API_URL+`user/me/avatar/${user._id}`);
        } catch (err) {
            setAvatar(DEFAULT);
        }
    }

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
                    
                    { createForm ?
                        <WorkoutForm token={user.Authorization} setCreateForm={setCreateForm} />
                        :
                        <Button variant='outline-success' onClick={ e => setCreateForm(true) }>Create</Button>
                    }
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;