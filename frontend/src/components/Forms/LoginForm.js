import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const LoginForm = () => {
    
    const navigate = useNavigate();

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    useEffect( () => {
        const loggedInUser = window.localStorage.getItem('user');
        if (loggedInUser) navigate('/');
    });

    const login = async () => {
        try {
            const { data } = await axios.post(process.env.REACT_APP_API_URL+"user/login", { email, password });
            window.localStorage.removeItem('user');
            window.localStorage.setItem(
                'user', 
                JSON.stringify({
                    Authorization: data.token
                })
            );
            navigate('/');   
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Container style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center'>
            <Container className='bg-light text-dark'>
                <h1 className='text-center'>Login</h1>
                <Form onSubmit={ e => {
                    e.preventDefault();
                    login();
                }}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="example@email.com" onChange={ e => setEmail(e.target.value) }/>
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={ e => setPassword(e.target.value) }/>
                    </Form.Group>
                    <Container className='text-center'>
                        <Button variant="outline-primary" type="submit">Login</Button>
                        <p className='text-center'><b>Don't have an account? </b><a href="/signup">Create an account</a></p>
                    </Container>
                </Form>
            </Container>
        </Container>
        
    );
};

export default LoginForm;