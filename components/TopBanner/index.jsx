import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import Link from "next/link";
import axiosInstance, { baseurl } from "../../misc/Axios";
import styles from "./top_banner.module.scss";
export default class index extends Component {
  state = {
    widget_0: null,
  };
  componentDidMount = () => {
    console.log("MOUNTING LAYOUT");
    axiosInstance.get(`${baseurl}/v1/info_widgets/0`).then((response) => {
      console.log("THIS IS WIDGET", response.data);
      this.setState({ ...this.state, widget_0: response.data.data });
    });
  };
  render() {
    return (
      <Col md={12} className="inner h-100">
        <Row className={styles.stg_top_banner}>
          {this.state.widget_0 ? (
            <Link href={this.state.widget_0.link}>
              <a className={styles.banner_link}>
                <img
                  src={this.state.widget_0.photo.image_url}
                  className="mx-auto d-block"
                />{" "}
              </a>
            </Link>
          ) : (
            ""
          )}
        </Row>
      </Col>
    );
  }
}
