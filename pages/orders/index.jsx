import Head from "next/head";
import Router from "next/router";
import React, { Component } from "react";
import { Col, Row, Table } from "reactstrap";
import UserContext from "../../components/UserContext";
import Layout from "../../misc/Layout";
import styles from "./orders.module.scss";
import _ from "lodash";
import axiosInstance from "../../misc/Axios";
import Link from "next/link";
import Image from "next/image";
import Function from "../../misc/Functions";
import NumberField from "../../misc/NumberField";
import FullLoadingWidget from "../../components/FullLoadingWidget/FullLoadingWidget";

export default class orders extends Component {
  static contextType = UserContext;
  state = {
    orders: [],
    loading: false,
  };

  componentDidMount = () => {
    if (!this.context.loggedIn()) {
      Router.push("/login");
    } else {
      this.setState({
        ...this.state,
        loading: true,
      });
      axiosInstance.get("/v1/users/orders").then((response) => {
        if (response.status == 200) {
          this.setState({
            ...this.state,
            orders: response.data.data,
            loading: false,
          });
        }
      });
    }
  };
  render() {
    return (
      <Col className={styles.wrapper}>
        <Row>
          <Col md={12} className={"topSide"}>
            <h2>My Orders</h2>
          </Col>
        </Row>
        <Row className="pageContent">
          <Col className="">
            {this.state.loading ? (
              <FullLoadingWidget loading={this.state.loading} />
            ) : _.isEmpty(this.state.orders) ? (
              this.noOrders()
            ) : (
              this.ordersContainer()
            )}
          </Col>
        </Row>
      </Col>
    );
  }
  noOrders = () => {
    return (
      <Col className={"h-400"}>
        <Row className="h-100 justify-content-md-center align-items-center">
          <Col className="centered">
            <img
              src="/images/no_orders.png"
              alt="Steaman Online Logo"
              className={styles.orders_image}
            />
            <h1>You currently dont have any Orders</h1>
          </Col>
        </Row>
      </Col>
    );
  };
  ordersContainer = () => {
    return (
      <Row>
        <Table striped={true} bordered={true}>
          <thead>
            <tr>
              <th width="80%">Product</th>

              <th width="20%">Order Status</th>
            </tr>
          </thead>
          {this.state.orders.map((order, index) => {
            return order.carts.map((cart, index) => {
              return (
                <tr>
                  <td>
                    <div className={styles.product_image}>
                      {cart.product.featured_photo != null &&
                      cart.product.featured_photo != "" ? (
                        <Image
                          width={200}
                          height={150}
                          layout="intrinsic"
                          src={cart.product.featured_photo}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <p>
                      Order No.{" "}
                      <Link href={`/orders/${order.uuid}`}>{order.number}</Link>
                    </p>
                    <p>
                      <Link href={`/products/${cart.product.slug}`}>
                        {cart.product.name}
                      </Link>{" "}
                      <br />
                      <small>
                        {" "}
                        {`${cart.quantity}pcs * `}GHS{" "}
                        <NumberField value={cart.price} />
                      </small>
                    </p>
                  </td>

                  <td>{cart.status_name}</td>
                </tr>
              );
            });
          })}
        </Table>
      </Row>
    );
  };
}
