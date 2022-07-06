import React, { useEffect, useState } from 'react';
import { Container, Button, CloseButton, OverlayTrigger, Popover  } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import ExerciseForm from './ExerciseForm';

const WorkoutForm = ({ token, setCreateForm }) => {
    
    // const [ exercises, setExercises ] = useState([]);
    const [ availableExercises, setAvailableExercises ] = useState([]);

    useEffect( () => {
        get_exercises();
    }, []);

    const get_exercises = async () => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_API_URL+"exercise", {
                headers: {
                    Authorization: token
                }
            });
            setAvailableExercises(data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Container>
            <CloseButton onClick={ e => { e.preventDefault(); setCreateForm(false); }} />
            { availableExercises ?
                <>
                    { availableExercises.map( exercise => {
                        return <p key={exercise._id}>{exercise.name}</p>
                    })}
                </>
                :
                <></>
            }
            <Button variant="outline-primary">Add</Button>
            <Container className='text-center'>
                <OverlayTrigger
                    trigger="click"
                    key='left'
                    placement='left'
                    overlay={
                        <Popover id={`popover-positioned-left`}>
                        <Popover.Body>
                            <ExerciseForm token={token} setCreateForm={setCreateForm} />
                        </Popover.Body>
                        </Popover>
                    }
                    >
                    <Button variant="outline-success">Create Exercise</Button>
                </OverlayTrigger>
            </Container>
        </Container>
    );
}

export default WorkoutForm;