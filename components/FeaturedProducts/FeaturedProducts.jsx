import Link from "next/link";
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import axiosIntance from "../../misc/Axios";
import ProductPortrait from "../ProductPortrait/ProductPortrait";
import styles from "./FeaturedProducts.module.scss";
export default class FeaturedProducts extends Component {
  state = {
    products: [],
  };
  componentDidMount = () => {
    console.log("Featured Products Mounted Man!!!");
  };
  render() {
    return (
      <Col md={12}>
        <Col md={12} className={styles.wrapper}>
          <Row>
            <Col md={12} className={styles.title}>
              <h3>Featured Products</h3>
            </Col>
            {this.props.products.map((product, index) => {
              return <ProductPortrait product={product} key={index} />;
            })}
          </Row>
        </Col>
      </Col>
    );
  }
}
