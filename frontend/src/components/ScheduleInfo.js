import React from 'react';
import axios from 'axios';

import { Button, Container, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ScheduleInfo = ({ user, setUser }) => {

    const handle_schedule_remove = async () => {
        try {
            await axios.patch(process.env.REACT_APP_API_URL+"user/me", {
                schedule: null
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

    return (
        <Container>
            <h3 className='text-center'>{user.schedule.name}</h3>
            <Button variant='outline-danger' onClick={handle_schedule_remove}>Remove</Button>
            {
                user.schedule.workouts.map( ( workout, i) => {
                    return (
                        <Container key={workout._id}>
                            <div>
                                {user.schedule.daysOfTheWeek[i]}: {workout.name} 
                                <Form.Check 
                                    type="checkbox" 
                                    checked={true}
                                    readOnly
                                />
                            </div>
                        </Container>
                    );
                })
            }
        </Container>
    );
};

export default ScheduleInfo;