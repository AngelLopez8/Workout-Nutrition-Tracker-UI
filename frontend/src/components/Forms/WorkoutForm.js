import React, { useEffect, useState } from 'react';
import { Container, Button, CloseButton, Form  } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import ExerciseForm from './ExerciseForm';

const WorkoutSelectForm = ({ user, setCreateWorkoutForm, createExerciseForm, setCreateExerciseForm }) => {

    const [ availableExercises, setAvailableExercises ] = useState([]);

    const [ numberOfExercises, setNumberOfExercises ] = useState(0);
    const [ workoutName, setWorkoutName ] = useState("");
    const [ workoutDesc, setWorkoutDesc ] = useState("");
    const [ exercises, setExercises ] = useState([]);

    useEffect( () => {
        get_exercises();
    }, []);

    useEffect( () => {
        get_exercises();
    }, [createExerciseForm]);

    const get_exercises = async () => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_API_URL+"exercise", {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setAvailableExercises(data);
        } catch (err) {
            console.log(err);
        }
    }

    const handle_create_workout = async (e) => {
        e.preventDefault();
        try {
            await axios.post(process.env.REACT_APP_API_URL+"workout", {
                name: workoutName, description: workoutDesc, exercises: exercises
            }, {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setCreateWorkoutForm(false);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Container
            className='rounded bg-dark'
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                minWidth: '300px',
                width: '50%',
            }}
        >
            <CloseButton onClick={ e => { e.preventDefault(); setCreateWorkoutForm(false); }} />
            <Form>
                <Form.Group className="mb-3" controlId="formWorkoutName">
                        <Form.Control type="text" placeholder="Workout Name" onChange={ e => setWorkoutName(e.target.value) }/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formWorkoutDesc">
                        <Form.Control type="text" placeholder="Workout Description" onChange={ e => setWorkoutDesc(e.target.value) }/>
                </Form.Group>
                {
                    [...Array(numberOfExercises)].map( (e, i) => {
                        return (
                            <Container key={i}>
                                <Form.Select onChange={ e=> setExercises([...exercises, e.target.value]) } >
                                    <option>Select a Exercise!</option>
                                    {
                                        availableExercises.map( exercise => {
                                            return (
                                                <option value={exercise._id} key={exercise._id}>
                                                    {exercise.name}
                                                </option>
                                            );
                                        })
                                    }
                                </Form.Select>
                                <br/>
                            </Container>
                        );
                    })
                }
                    <Button variant="outline-primary" onClick={ e => { e.preventDefault(); setNumberOfExercises(numberOfExercises + 1)}}>Add Exercise</Button>
                    <Button variant="outline-primary" onClick={ e => { e.preventDefault(); setCreateExerciseForm(true); }}>Create Exercise</Button>
                    <Button variant="outline-success" onClick={handle_create_workout}>Create Workout</Button>
            </Form>
        </Container>
    );
};

const WorkoutForm = ({ user, setCreateWorkoutForm }) => {

    const [ createExerciseForm, setCreateExerciseForm ] = useState(false);

    return (
        <Container>
            <WorkoutSelectForm 
                user={user}
                setCreateWorkoutForm={setCreateWorkoutForm}
                createExerciseForm={createExerciseForm}
                setCreateExerciseForm={setCreateExerciseForm}
            />
            { createExerciseForm ?
                <ExerciseForm 
                    user={user} 
                    setCreateExerciseForm={setCreateExerciseForm} 
                />
                :<></>
            }
        </Container>
    );
}

export default WorkoutForm;