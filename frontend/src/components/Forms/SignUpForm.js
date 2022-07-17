import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const SignUpForm = ({ user, setUser }) => {

    const navigate = useNavigate();
    
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirm, setConfirm ] = useState("");
    const [ age, setAge ] = useState(undefined);

    const [ signedUp, setSignedUp ] = useState(false);

    useEffect( () => {
        if (user.Authorization) {
            navigate('/', { replace: true});
        }
    }, [user]);

    useEffect( () => {
        if (signedUp) {
            signUp();
            navigate('/', { replace: true});
        }
    }, [signedUp]);

    const signUp = async () => {
        try {
            const { data } = await axios.post(process.env.REACT_APP_API_URL+"user/", { name, email, password, age });
            window.localStorage.removeItem('Authorization');
            window.localStorage.setItem('Authorization', data.token);
            setUser({...data.user, Authorization: data.token});
        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (password === confirm) {
            setSignedUp(true);
        }
    }

    return (
        <Container style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center'>
            <Container className='bg-light text-dark'>
                <h1 className='text-center'>Sign Up</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3' controlId='formFullName'>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type='text' placeholder='Full Name' onChange={ e => setName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formAge'>
                        <Form.Label>Age</Form.Label>
                        <Form.Control type='text' placeholder='Age' onChange={ e => setAge(e.target.value)} />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formEmail'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type='email' placeholder='example@email.com' onChange={ e => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formPassword'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Password' onChange={ e => setPassword(e.target.value)} />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formConfirmPassword'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password' placeholder='Confirm Password' onChange={ e => setConfirm(e.target.value)} />
                    </Form.Group>

                    <Container className='text-center'>
                        <Button variant="outline-primary" type="submit">Sign Up</Button>
                        <p><b>Already have an account? </b><a href="/login">Sign In</a></p>
                    </Container>
                </Form>
            </Container>
        </Container>
    );
}

export default SignUpForm;