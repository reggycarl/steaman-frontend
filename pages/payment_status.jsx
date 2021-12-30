import Head from 'next/head'
import React, { Component } from 'react'
import { Col, Row } from 'reactstrap'

export default class payment extends Component {
    render() {
        return (
            <>
            <Head>
              <title>Checkout</title>
            </Head>
            <Col className="topSide" md={12}>
              <h1>Checkout</h1>
            </Col>
            <Col md={12}>
              <Row>
              </Row>
            </Col>
            </>
        )
    }
}
