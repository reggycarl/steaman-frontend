import { Button } from 'reactstrap';
import Link from 'next/link';
import React, { Component } from 'react'
import { Col, Row } from 'reactstrap'
import styles from '../styles/auth.module.scss';
export default class Confirmed extends Component {
    render() {
        return (
            <Col md={12} className={styles.wrapper}>
                <Row className="justify-content-md-center align-items-center h-100"> 
            <Col md={6}>
                <h1>Email Confirmed</h1>
                <p>Your Email has been succesfully Confirmed</p>
                <Link href="/login">
                    
                    <Button color={"success"}>Login to your account </Button>
                </Link>
                </Col>
                </Row>
            </Col>
            
        )
    }
}
