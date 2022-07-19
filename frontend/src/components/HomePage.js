import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';

import DEFAULT from './Images/DEFAULT.jpg';

import ScheduleInfo from './ScheduleInfo';
import ScheduleForm from './Forms/ScheduleForm.js';

import ProgressInfo from './ProgressInfo.js';

const DaysOfTheWeek = {
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
    7: "Saturday"
};

const HomePage = ({ user, setUser }) => {
    const navigate = useNavigate();

    const [ todaysWorkout, setTodaysWorkout ] = useState({});

    const [ progresses, setProgresses ] = useState([]);

    const [ profileUpdate, setProfileUpdate ] = useState(false);
    const [ selectCreateSchedule, setSelectCreateSchedule ] = useState(false);
    const [ logout, setLogout ] = useState(false);

    // // On Change to Use State
    useEffect( () => {

        if (!user.Authorization) navigate('/login', { replace:true });

        if (user._id) get_progresses();
            
        // On Change to the User State update today's Workout if exists
        if (user.schedule) {
            const today = new Date();
            user.schedule.daysOfTheWeek.forEach( ( day, i) => {
                console.log(`${day}`);
                if (user.schedule.workouts[i]) console.log(`${user.schedule.workouts[i].name}`)
                if (day === DaysOfTheWeek[today.getDay()]) {
                    setTodaysWorkout(user.schedule.workouts[i]);
                }
            });
        } else {
            setTodaysWorkout({});
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
    }, [logout]);

    const get_progresses = async () => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_API_URL+"progress", {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setProgresses(data);
            // setUser({Authorization: user.Authorization});
        } catch (err) {
            console.log(err);
        }
    }

    // Logs User out and delete's authentication token from database through POST request
    const handle_logout = async () => {
        try {
            await axios.post(process.env.REACT_APP_API_URL+"user/logout", {}, {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setUser({});
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Image 
                        thumbnail
                        src={process.env.REACT_APP_API_URL+`user/me/avatar/${user._id}`} 
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = DEFAULT;
                        }}
                    />
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
                            <h5>Height: {Math.floor(user.height / 12)} ft. {user.height % 12} in.</h5>
                            <h5>Weight: {user.weight} lbs.</h5>
                        </>
                        : <></>
                    }
                    <Button variant="outline-primary" onClick={ e => { e.preventDefault(); setProfileUpdate(true);}}>Update Profile</Button>
                    {" "}
                    <Button variant="outline-warning" onClick={ e => { e.preventDefault(); setLogout(true); }}>Logout</Button>
                </Col>
                <Col>
                    <h1>Schedule</h1>
                    { user.schedule ?
                        <ScheduleInfo user={user} setUser={setUser} progresses={progresses} />
                        :
                        <>
                            { selectCreateSchedule ?
                                <ScheduleForm 
                                    user={user} 
                                    setUser={setUser} 
                                    setSelectCreateSchedule={setSelectCreateSchedule} 
                                />
                                :
                                <>
                                    <h4>No Schedule exists.</h4>
                                    <h4>Please Select/Create a Schedule.</h4>
                                    <Button variant="outline-success" onClick={ e => { e.preventDefault(); setSelectCreateSchedule(true);}}>Select/Create Schedule</Button>
                                </>
                            }
                        </>
                    }
                    <h1>Progress</h1>
                    <ProgressInfo progresses={progresses} setProgresses={setProgresses} />
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;