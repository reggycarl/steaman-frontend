import React, { Component } from "react";
import { Col } from "reactstrap";
import styles from './pickup_location.module.scss'
export default class PickupLocationWidget extends Component {
  render() {
    return (
      <Col className={styles.wrapper} >
        {this.props.pickup_location.name}
        <br />
        <b>GPS Code: </b>
        {this.props.pickup_location.gps_code}
        <br />
        <b>Address: </b>
        {this.props.pickup_location.address}
        <br />
        <b>Contact Information: </b>
        {this.props.pickup_location.contact_information}
        <br />
      </Col>
    );
  }
}
