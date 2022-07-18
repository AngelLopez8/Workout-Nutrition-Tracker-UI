import React, { useState } from 'react';
import { Container, Form, Button, CloseButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const ExerciseForm = ({ user, setCreateExerciseForm }) => {

    const [ name, setName ] = useState('');
    const [ bodyArea, setBodyArea ] = useState('');
    const [ numberOfSets, setNumberOfSets ] = useState(0);
    const [ numberOfReps, setNumberOfReps ] = useState(0);
    const [ timePerSet, setTimePerSet ] = useState(0);

    const handle_create_exercise = async (e) => {
        e.preventDefault();
        try {
            await axios.post(process.env.REACT_APP_API_URL+"exercise", {
                name, bodyArea, sets: numberOfSets, reps: numberOfReps, time: timePerSet
            }, {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setCreateExerciseForm(false);
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
                width: '50%'
            }}
        >
            <CloseButton onClick={ e => { e.preventDefault(); setCreateExerciseForm(false); }} />
            <Form onSubmit={handle_create_exercise}>
                <Form.Group className='mb-3' controlId='formExerciseName'>
                    <Form.Control type='text' placeholder='Exercise Name' onChange={ e => setName(e.target.value)} />
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBodyArea'>
                    <Form.Control type='text' placeholder='Body Area' onChange={ e => setBodyArea(e.target.value)} />
                </Form.Group>

                <Form.Group className='mb-3' controlId='formNumberOfSets'>
                    <Form.Control type='text' placeholder='Number of Sets' onChange={ e => setNumberOfSets(e.target.value)} />
                </Form.Group>

                <Form.Group className='mb-3' controlId='formNumberOfReps'>
                    <Form.Control type='text' placeholder='Number of Reps' onChange={ e => setNumberOfReps(e.target.value)} />
                </Form.Group>

                <Form.Group className='mb-3' controlId='formTimePerSet'>
                    <Form.Control type='text' placeholder='Time per Set' onChange={ e => setTimePerSet(e.target.value)} />
                </Form.Group>

                <Container className='text-center'>
                    <Button variant="outline-primary" type="submit">Create</Button>
                </Container>
            </Form>
        </Container>
    );
}

export default ExerciseForm;