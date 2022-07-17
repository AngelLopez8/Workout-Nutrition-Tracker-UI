import React, { useEffect, useState } from 'react';
import { Container, Button, CloseButton, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import WorkoutForm from './WorkoutForm';

const ScheduleSelectForm = ({ user, setUser, createScheduleForm, setSelectCreateSchedule, setCreateScheduleForm }) => {

    const [ availableSchedules, setAvailableSchedules ] = useState([]);

    const [ schedule, setSchedule ] = useState("");

    useEffect( () => {
        get_schedules();
    }, []);

    useEffect( () => {
        get_schedules();
    }, [createScheduleForm]);

    const get_schedules = async() => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_API_URL+"schedule", {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setAvailableSchedules(data);
        } catch (err) {
            console.log(err);
        }
    }

    const handle_select = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(process.env.REACT_APP_API_URL+"user/me", {
                schedule: schedule
            }, {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setUser({Authorization: user.Authorization});
            setSelectCreateSchedule(false);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Container>
            <CloseButton onClick={ e => { e.preventDefault(); setSelectCreateSchedule(false); }} />
            <Form.Select onChange={ e => setSchedule(e.target.value)}>
                <option>Select a Workout Schedule below.</option>
                { availableSchedules ?
                    <>
                        {
                            availableSchedules.map( schedule => {
                                return (
                                    <option
                                        value={schedule._id} 
                                        key={schedule._id}
                                    >
                                        {schedule.name}
                                    </option>
                                );
                            })
                        }
                    </> : <></>
                }
            </Form.Select>
            <Button variant="outline-primary" onClick={handle_select}>Select</Button>
            <Button variant="outline-success" onClick={ e => { e.preventDefault(); setCreateScheduleForm(true); }}>Create</Button>
        </Container>
    );
}

const ScheduleCreateForm = ({ user, setCreateScheduleForm, createWorkoutForm, setCreateWorkoutForm }) => {

    const [ availableWorkouts, setAvailableWorkouts ] = useState([]);

    const [ numberOfWorkouts, setNumberOfWorkouts ] = useState(0);
    const [ scheduleName, setScheduleName ] = useState("");
    const [ workoutDays, setWorkoutDays ] = useState([]);
    const [ workouts, setWorkouts ] = useState([]);

    useEffect( () => {
        get_workouts();
    }, []);

    useEffect( () => {
        get_workouts();
    }, [createWorkoutForm]);

    const get_workouts = async() => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_API_URL+"workout", {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setAvailableWorkouts(data);
        } catch (err) {
            console.log(err);
        }
    }

    const handle_create_schedule = async (e) => {
        e.preventDefault();
        try {
            await axios.post(process.env.REACT_APP_API_URL+"schedule", {
                name: scheduleName, daysOfTheWeek: workoutDays, workouts: workouts
            }, {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setCreateScheduleForm(false);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Container>
            <CloseButton onClick={ e => { e.preventDefault(); setCreateScheduleForm(false); }} />
            <Form>
                <Form.Group className="mb-3" controlId="formScheduleName">
                    <Form.Control type="text" placeholder="Schedule Name" onChange={ e => setScheduleName(e.target.value) }/>
                </Form.Group>
                    {
                        [...Array(numberOfWorkouts)].map( (e, i) => {
                            return(
                                <Container key={i}>
                                   <Form.Select onChange={ e => setWorkoutDays([...workoutDays, e.target.value]) }>
                                        <option>Select a Day of the Week!</option>
                                        {
                                            ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map( dayOfTheWeek => {
                                                return (
                                                    <option value={dayOfTheWeek} key={dayOfTheWeek}>
                                                        {dayOfTheWeek}
                                                    </option>
                                                );
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Select onChange={ e => setWorkouts([...workouts, e.target.value]) }>
                                        <option>Select a Workout!</option>
                                        {
                                            availableWorkouts.map( workout => {
                                                return (
                                                    <option value={workout._id} key={workout._id}>
                                                        {workout.name}
                                                    </option>
                                                );
                                            })
                                        }
                                    </Form.Select> 
                                </Container>
                            );
                        })
                    } 
                <Button variant="outline-primary" onClick={ e => { e.preventDefault(); setNumberOfWorkouts(numberOfWorkouts + 1);}}>Add Workout</Button>
                <Button variant="outline-primary" onClick={ e=> { e.preventDefault(); setCreateWorkoutForm(true); }}>Create Workout</Button>
                <Button variant="outline-success" onClick={handle_create_schedule}>Create Schedule</Button>
            </Form>
        </Container>
    );
};

const ScheduleForm = ({ user, setUser, setSelectCreateSchedule }) => {

    const [ createScheduleForm, setCreateScheduleForm ] = useState(false);
    const [ createWorkoutForm, setCreateWorkoutForm ] = useState(false);

    return (
        <Container>
            {/** SELECT A SCHEDULE FORM */}
            <ScheduleSelectForm
                user={user}
                setUser={setUser}
                createScheduleForm={createScheduleForm}
                setSelectCreateSchedule={setSelectCreateSchedule}
                setCreateScheduleForm={setCreateScheduleForm}
            />
            
            {/** CREATE A SCHEDULE FORM */}
            { createScheduleForm ?
                <ScheduleCreateForm 
                    user={user}
                    createWorkoutForm={createWorkoutForm}
                    setCreateScheduleForm={setCreateScheduleForm}
                    setCreateWorkoutForm={setCreateWorkoutForm}
                />
                :<></>
            }

            {/** CREATE A WORKOUT FORM */}
            { createWorkoutForm ?
                <WorkoutForm
                    user={user}
                    setCreateWorkoutForm={setCreateWorkoutForm}
                />
                :<></>
            }
        </Container>
    );
};

export default ScheduleForm;