import React, { useEffect, useState } from 'react';
import { Container, Button, CloseButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// import WorkoutForm from './WorkoutForm';

const ScheduleForm = ({ token, setSelectCreateSchedule }) => {
    
    const [ availableSchedules, setAvailableSchedules ] = useState([]);

    useEffect( () => {
        get_schedules();
    }, []);

    const get_schedules = async() => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_API_URL+"schedule", {
                headers: {
                    Authorization: token
                }
            });
            setAvailableSchedules(data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Container>
            <CloseButton onClick={ e => { e.preventDefault(); setSelectCreateSchedule(false); }} />
            { availableSchedules ?
                <>
                    {
                        availableSchedules.map( schedule => {
                            return <p key={schedule._id}>{schedule._id}</p>
                        })
                    }
                </> : <></>
            }
            <Button variant="outline-primary">Select</Button>
            <Button variant="outline-success">Create</Button>
        </Container>
    );
};

export default ScheduleForm;