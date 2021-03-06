import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import DEFAULT from '../Images/DEFAULT.jpg';

const ProfileChangeForm = ({ user, setUser }) => {
    
    const navigate = useNavigate();

    const [ avatar, setAvatar ] = useState('');
    
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ age, setAge ] = useState(null);
    const [ height, setHeight ] = useState(0);
    const [ weight, setWeight ] = useState(0);
    const [ newAvatar, setNewAvatar ] = useState('');

    const [ updated, setUpdated ] = useState(false);
    const [ deleteUser, setDeleteUser ] = useState(false);
    const [ logoutAll, setLogoutAll ] = useState(false);

    useEffect( () => {
        if (user._id && avatar === "") setAvatar(process.env.REACT_APP_API_URL+`user/me/avatar/${user._id}` || DEFAULT);
    }, [user]);

    useEffect( () => {
        if (updated) {
            update_user();
            if (newAvatar !== '') update_avatar();
            navigate('/', { replace: true});
        }
    }, [updated])

    useEffect( () => {
        if (deleteUser) {
            window.localStorage.removeItem('Authorization');
            delete_user();
            navigate('/login', { replace: true});
        }
    }, [deleteUser]);

    useEffect( () => {
        if (logoutAll) {
            window.localStorage.removeItem('Authorization');
            logout_all_users();
            navigate('/login', { replace: true});
        }
    }, [logoutAll]);

    const delete_user = async () => {
        try {
            await axios.delete(process.env.REACT_APP_API_URL+'user/me', {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setUser({});
        } catch (err) {
            console.log(err);
        }
    }

    const logout_all_users = async () => {
        try {
            await axios.post(process.env.REACT_APP_API_URL+'user/logout/all', {}, {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setUser({});
        } catch (err) {
            console.log(err);
        }
    }

    const update_user = async () => {
        try {
            await axios.patch(process.env.REACT_APP_API_URL+"user/me", {
                name: name === "" ? user.name : name,
                email: email === "" ? user.email : email,
                age: age === null ? user.age : age,
                height: height === 0 ? user.height : height,
                weight: weight === 0 ? user.weight : weight,
            }, {
                headers: {
                    Authorization: user.Authorization
                }
            });
            setUser({Authorization: user.Authorization});
        } catch (err) {
            console.log(err);
        }
    }

    const update_avatar = async () => {
        try {
            const data = new FormData();
            data.append('avatar', newAvatar);
            
            await axios.post(process.env.REACT_APP_API_URL+"user/me/avatar", data, {
                headers: {
                    Authorization: user.Authorization
                }
            });
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
                <Form onSubmit={e => { e.preventDefault(); setUpdated(true); }}>

                    {/* AVATAR FIELD */}
                    <Form.Group className='mb-3' controlId='formAvatar'>
                        <Form.Control type='file' onChange={ e => setNewAvatar(e.target.files[0]) } />
                    </Form.Group>

                    {/* NAME FIELD */}
                    <Form.Group className='mb-3' controlId='formFullName'>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type='text' placeholder={user.name ? user.name : 'Full Name'} onChange={ e => setName(e.target.value)} />
                    </Form.Group>

                    {/* EMAIL FIELD */}
                    <Form.Group className='mb-3' controlId='formEmail'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type='email' placeholder={user.email ? user.email : 'example@email.com'} onChange={ e => setEmail(e.target.value)} />
                    </Form.Group>

                    {/* AGE FIELD */}
                    <Form.Group className='mb-3' controlId='formAge'>
                        <Form.Label>Age</Form.Label>
                        <Form.Control type='text' placeholder={user.age ? user.age : 'Age'} onChange={ e => setAge(e.target.value)} />
                    </Form.Group>

                    {/* HEIGHT FIELD */}
                    <Form.Group className='mb-3' controlId='formHeight'>
                        <Form.Label>Height</Form.Label>
                        <Form.Control type='text' placeholder={user.height ? `${user.height} in.` : 'Height in in.'} onChange={ e => setHeight(e.target.value)} />
                    </Form.Group>

                    {/* WEIGHT FIELD */}
                    <Form.Group className='mb-3' controlId='formWeight'>
                        <Form.Label>Weight</Form.Label>
                        <Form.Control type='text' placeholder={user.weight ? `${user.weight} lbs.` : 'Weight in lbs.'} onChange={ e => setWeight(e.target.value)} />
                    </Form.Group>
                    
                    <Container className='text-center'>
                        <Button variant="outline-primary" type="submit">Update</Button>
                        {" "}
                        <Button variant='outline-danger' type='button' onClick={ e => { e.preventDefault(); setDeleteUser(true); }}>Delete Account</Button>
                        {" "}
                        <Button variant='outline-info' type='button' onClick={ e => { e.preventDefault(); setLogoutAll(true); }}>Logout All</Button>
                        {" "}
                        <Button variant='outline-warning' type='button' onClick={ e => { e.preventDefault(); setUpdated(true); }}>Cancel</Button>      
                    </Container>
                </Form>
            </Container>
        </Container>
    );
}

export default ProfileChangeForm;