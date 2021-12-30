
import Head from 'next/head'
import Link from 'next/link'
import React, { Component } from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { Col, Row, Button } from 'reactstrap'
import styles from '../styles/payments.module.scss'
export default class payments extends Component {
    render() {
        return (
            <>
            <Head>
              <title>Payment Status</title>
            </Head>
            <Col className="topSide" md={12}>
              <h1>Payment</h1>
            </Col>
            <Col className={`pageContent ${styles.wrapper}`} md={12}>
              <Row>
              
                  
                  {this.props.status == "success" ? this.successfulPayment() : this.paymentFailed()}
                  
              </Row>
            </Col>
            </>
        )
    }

    successfulPayment = () => {
        return <Col className="centered">
            <FaCheckCircle color="green" size={60} />
            <p>&nbsp;</p>
            <h4>Payment Successfully Processed</h4>
            <Link href='/'>
            <Button color='success'>Continue Shopping</Button>
            </Link>
        </Col>
    }
    paymentFailed = () => {
        return <Col className="centered">
        <FaTimesCircle color="red" size={60} />
        <p>&nbsp;</p>
        <h4>Payment Processing Failed</h4>
        <Link href='/'>
            <Button color='success'>Continue Shopping</Button>
        </Link>
        
    </Col>
    }
}
export async function getServerSideProps(context) {
    console.log("THIS IS ID");
    var status = context.query.status;
    // var term = context.params.search_term;
    
    return {
      props: { status: status }, // will be passed to the page component as props
    };
  }
