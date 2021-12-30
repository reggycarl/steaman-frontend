import React, { Component } from "react";
import { Col, Row, Table } from "reactstrap";
import styles from "./orders.module.scss";
import axiosInstance, { baseurl } from "../../misc/Axios";
import FullLoadingWidget from "../../components/FullLoadingWidget/FullLoadingWidget";
import NumberField from "../../misc/NumberField";
import _ from "lodash";
import Link from "next/link";
export default class Order extends Component {
  state = {
    order: {
      carts: [],
      payments: [],
    },
    loading: false,
  };
  componentDidMount = () => {
    this.setState({
      ...this.state,
      loading: true,
    });
    axiosInstance
      .get(`/v1/users/orders/${this.props.order_id}`)
      .then((response) => {
        console.log(response.data);
        if (response.status == 200) {
          this.setState({
            ...this.state,
            order: {
              ...this.state.order,
              ...response.data.order,
            },
            loading: false,
          });
        }
      });
  };
  render() {
    return this.state.loading ? (
      <FullLoadingWidget loading={this.state.loading} />
    ) : (
      <Col className={styles.wrapper}>
        <Row>
          <Col md={12} className={"topSide"}>
            <h2>Order No: {this.state.order.number} </h2>
          </Col>
        </Row>
        <Row className="pageContent">
          <Col>
            <p>Order Status: {this.state.order.status_name} </p>
            <h5>Items in Order</h5>

            <Table striped={true} bordered={true}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {this.state.order.carts.map((cart) => {
                  return (
                    <tr>
                      <td>
                        <Link href={`/products/${cart.product.slug}`}>
                          {cart.product.name}
                        </Link>
                      </td>
                      <td>{cart.quantity} </td>
                      <td className="right">
                        <NumberField value={cart.price} />{" "}
                      </td>
                      <td className="right">
                        <NumberField value={cart.price * cart.quantity} />{" "}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={3}>Discounts</td>
                  <td className="right">
                    (<NumberField value={this.state.order.discount_amount} />){" "}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>Delivery Fee</td>
                  <td className="right">
                    <NumberField value={this.state.order.delivery_fee} />{" "}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>
                    <b>Total</b>
                  </td>
                  <td className="right">
                    <b>
                      <NumberField value={this.state.order.total_amount} />{" "}
                    </b>
                  </td>
                </tr>
              </tbody>
            </Table>

            <h5>Payments on Order</h5>
            <Table striped={true} bordered={true}>
              <thead>
                <td>Reference</td>
                <td>Description</td>
                <td>Amount</td>
                <td>Status</td>
              </thead>
              <tbody>
                {_.isEmpty(this.state.order.payments)
                  ? this.noPayments()
                  : this.paymentsList()}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Col>
    );
  }
  noPayments() {
    return (
      <tr>
        <td colSpan={4} className="centered">
          No Payments for this Order
        </td>
      </tr>
    );
  }
  paymentsList() {
    return this.state.order.payments.map((pmt) => {
      return (
        <tr>
          <td>{pmt.number} </td>
          <td>{pmt.description} </td>
          <td className="right">
            <NumberField value={pmt.amount} />
          </td>
          <td>{pmt.status_name} </td>
        </tr>
      );
    });
  }
}

export async function getServerSideProps(context) {
  console.log("THIS IS ID");
  var order_id = context.params.order_id;

  // var order = await response.json();
  // console.log(order);
  return {
    props: { order_id: order_id }, // will be passed to the page component as props
  };
}
