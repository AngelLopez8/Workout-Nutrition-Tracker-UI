import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const ProfileChangeForm = () => {
    const navigate = useNavigate();

    const [ user, setUser ] = useState({});
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ age, setAge ] = useState();
    const [ avatar, setAvatar ] = useState('');
    const [ newAvatar, setNewAvatar ] = useState('');

    const [ updated, setUpdated ] = useState(false);
    const [ deleteUser, setDeleteUser ] = useState(false);

    useEffect( () => {
        const loggedInUser = window.localStorage.getItem('user');
        if (loggedInUser) {
            const data = JSON.parse(loggedInUser);
            get_user(data.Authorization);
        } else {
            navigate('/login', { replace: true});
        }
    }, []);

    useEffect( () => {
        if (user._id && avatar === '') handleAvatar();
    }, [user]);

    useEffect( () => {
        if (updated) navigate('/');
    }, [updated])

    useEffect( () => {
        if (deleteUser) {
            delete_user();
            navigate('/login');
        }
    }, [deleteUser]);

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

    const delete_user = async () => {
        try {
            await axios.delete(process.env.REACT_APP_API_URL+'user/me', {
                headers: {
                    Authorization: user.Authorization
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    // Retrieves User Avatar with proper authentication through GET request
    const handleAvatar = async () => {
        try {
            await axios.get(process.env.REACT_APP_API_URL+`user/me/avatar/${user._id}`);
            setAvatar(process.env.REACT_APP_API_URL+`user/me/avatar/${user._id}`);
        } catch (err) {
            setAvatar('None');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(process.env.REACT_APP_API_URL+"user/me", {
                name: name === "" ? user.name : name,
                email: email === "" ? user.email : email,
                age: age === "" ? user.age : age
            }, {
                headers: {
                    Authorization: user.Authorization
                }
            });

            if (newAvatar !== '') {
                const data = new FormData();
                data.append('avatar', newAvatar);
                
                await axios.post(process.env.REACT_APP_API_URL+"user/me/avatar", data, {
                    headers: {
                        Authorization: user.Authorization
                    }
                });
            }

            setUpdated(true);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Container style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center'>
            <Container className='bg-light text-dark'>
                <h1 className='text-center'>Update Profile</h1>
                { avatar !== '' ?
                    <Container className='text-center'><Image src={avatar} thumbnail /></Container> : <></>
                }
                <Form onSubmit={handleSubmit}>

                    <Form.Group className='mb-3' controlId='formAvatar'>
                        <Form.Control type='file' onChange={ e => setNewAvatar(e.target.files[0]) } />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formFullName'>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type='text' placeholder={user.name ? user.name : 'Full Name'} onChange={ e => setName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formAge'>
                        <Form.Label>Age</Form.Label>
                        <Form.Control type='text' placeholder={user.age ? user.age : 'Age'} onChange={ e => setAge(e.target.value)} />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formEmail'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type='email' placeholder={user.email ? user.email : 'example@email.com'} onChange={ e => setEmail(e.target.value)} />
                    </Form.Group>
                    <Container className='text-center'>
                        <Button variant="outline-primary" type="submit">Update</Button>
                        {" "}
                        <Button variant='outline-danger' type='button' onClick={ e => { e.preventDefault(); setDeleteUser(true); }}>Delete Account</Button>
                        {" "}
                        <Button variant='outline-warning' type='button' onClick={ e => { e.preventDefault(); setUpdated(true); }}>Cancel</Button>      
                    </Container>
                </Form>
            </Container>
        </Container>
    );
}

export default ProfileChangeForm;