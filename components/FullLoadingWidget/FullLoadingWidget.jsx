import React, { Component } from "react";
import styles from "./full_loading.module.scss";
import ScaleLoader from 'react-spinners/ScaleLoader'
import { Col, Row } from "reactstrap";
export default class FullLoadingWidget extends Component {
  render() {
    return (
     this.props.loading ?  <Col className={styles.wrapper}>
          <Row className='align-items-center h-100 justify-content-center'>
          <Col   className='loader'>
        <ScaleLoader
        className={styles.loader}
          sizeUnit={"px"}
          height={10}
          color={"#000"}
          loading={this.props.loading}
        />
        <br />
        Loading....
        </Col>
        </Row>
      </Col> : ""
    );
  }
}
