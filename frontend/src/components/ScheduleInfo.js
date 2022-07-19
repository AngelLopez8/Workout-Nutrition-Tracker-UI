import React, { useEffect } from 'react';
import axios from 'axios';

import { Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ScheduleInfo = ({ user, setUser, progresses }) => {

    // useEffect( () => {
    //     if (progresses.length > 0) {
    //         console.log(user.schedule._id === progresses[0].schedule._id);
    //         console.log(user.schedule.daysOfTheWeek);
    //         console.log(progresses[0].workoutsDone);
    //     }
    // }, [progresses]);

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
                            </div>
                        </Container>
                    );
                })
            }
        </Container>
    );
};

export default ScheduleInfo;