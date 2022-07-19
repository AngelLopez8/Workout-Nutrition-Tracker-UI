import React from 'react';

import { Container, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProgressInfo = ({ progresses, setProgresses }) => {

    return (
        <Container className="border">
            {/* Show Progress from recent to oldest */}
            {
                progresses.slice(0).reverse().map( progress => {
                    return (
                        <Container key={progress._id}>
                            <h5>{progress.schedule.name}</h5>
                            <p>{progress.startDate}</p>
                            {
                                progress.schedule.workouts.map( (workout, i) => {
                                    return (
                                        <Container key={workout._id}>
                                            <div>
                                                {`${progress.schedule.daysOfTheWeek[i]}: ${workout.name}`} 
                                                <Form.Check 
                                                    type="checkbox" 
                                                    checked={ progress.workoutsDone[i] ?  progress.workoutsDone[i] : false }
                                                    readOnly
                                                />
                                            </div>
                                        </Container>
                                    );
                                })
                            }
                        </Container>
                    );
                })
            }
        </Container>
    );
}

export default ProgressInfo;