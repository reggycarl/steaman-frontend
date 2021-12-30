import Head from 'next/head'
import React, { Component } from 'react'
import { Col, Row } from 'reactstrap'
import FullLoadingWidget from '../../components/FullLoadingWidget/FullLoadingWidget'
import styles from './order_payment.module.scss'
export default class OrderPayment extends Component {
    state ={
        loading: false
    }
    render() {
        return (
            
                <>
            <Head>
            <title>Order Payment</title>
          </Head>
          
          <Col className="topSide" md={12}>
            <h1>Order Payment</h1>
          </Col>
          { this.state.loading ? <FullLoadingWidget  loading={this.state.loading} /> : <Col className={`pageContent ${styles.wrapper}`} md={12}>
            <Row>
                <iframe src = "https://checkout-testing.herokuapp.com/v3/hosted/pay/6ca1d2097ead84a86402" width = "100%" height = "600" styles={styles.iframe} />
            </Row>
        </Col> }
        
        </>
            
        )
    }
}
