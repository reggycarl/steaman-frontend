import Head from "next/head";
import Link from "next/link";
import React, { Component } from "react";
import { Col, Row, Table, Button, Input } from "reactstrap";
import FullLoadingWidget from "../components/FullLoadingWidget/FullLoadingWidget";
import ItemQuantityWidget from "../components/ItemQuantityWidget/ItemQuantityWidget";
import UserContext from "../components/UserContext";
import axiosInstance from "../misc/Axios";
import NumberField from "../misc/NumberField";
import { baseurl } from "../misc/Axios";
import _ from "lodash";

import styles from "../styles/cart.module.scss";
// import styles from '../styles/Home.module.scss';
export default class ShoppingCart extends Component {
  static contextType = UserContext;
  state = {
    carts: [],
    loading: false,
  };
  componentDidMount = () => {
    this.setState({
      ...this.state,
      loading: true,
    });
    if (this.context.loggedIn()) {
      axiosInstance
        .get("/v1/users/carts?with_product=true")
        .then((response) => {
          console.log(response.data);
          this.setState({
            ...this.state,
            carts: response.data.cart,
            loading: false,
          });
        });
    } else {
      var cart = localStorage.getItem("cart");
      console.log("THIS IS CART", cart);
      if (cart != null && cart != "") {
        cart = JSON.parse(cart);
        var product_ids = cart.map((c) => c.product_id);
        axiosInstance
          .get(`/v1/products/?from_ids=${product_ids}`)
          .then((response) => {
            var products = response.data.products;
            cart = cart.map((c) => {
              return {
                ...c,
                product: products.find((element) => {
                  return element.id == c.product_id;
                }),
              };
            });
            this.setState({
              ...this.state,
              carts: cart,
              loading: false,
            });
          });
      } else {
        this.setState({
          ...this.state,
          loading: false,
        });
      }
    }
  };
  addQuantity = (cart) => {
    if (this.context.loggedIn()) {
      this.setState({
        ...this.state,
        loading: true,
      });
      axiosInstance
        .put(`/v1/users/carts/${cart.uuid}?type=add`)
        .then((response) => {
          console.log(response);
          this.setState({
            ...this.state,
            carts: response.data.cart,
            loading: false,
          });
        });
    } else {
      var carts = this.state.carts;
      console.log("THIS IS CART", cart);

      var index = carts.findIndex((c) => {
        console.log("ITEM 1", c);
        console.log("ITEM 2", cart);
        return c.product_id == cart.product_id;
      });
      console.log("THIS IS INDEX", index);
      var cart = carts[index];
      var cart = { ...cart, quantity: cart.quantity + 1 };

      carts[index] = cart;

      this.setState({
        ...this.state,
        carts: carts,
      });
      localStorage.setItem("cart", JSON.stringify(carts));
    }
  };
  reduceQuantity = (cart) => {
    this.setState({
      ...this.state,
      loading: true,
    });
    if (this.context.loggedIn()) {
      axiosInstance
        .put(`/v1/users/carts/${cart.uuid}?type=reduce`)
        .then((response) => {
          console.log(response);
          this.setState({
            ...this.state,
            carts: response.data.cart,
            loading: false,
          });
        });
    } else {
      var carts = this.state.carts;
      console.log("THIS IS CART", cart);

      var index = carts.findIndex((c) => {
        console.log("ITEM 1", c);
        console.log("ITEM 2", cart);
        return c.product_id == cart.product_id;
      });
      console.log("THIS IS INDEX", index);
      var cart = carts[index];
      var quantity = cart.quantity - 1;
      if (quantity < 0) {
        carts.splice(index, 1);
      } else {
        cart = { ...cart, quantity: quantity };
        carts[index] = cart;
      }

      this.setState({
        ...this.state,
        carts: carts,
      });
      localStorage.setItem("cart", JSON.stringify(carts));
    }
  };
  setQuantity = (cart, quantity) => {
    this.setState({
      ...this.state,
      loading: true,
    });
    axiosInstance
      .put(`/v1/users/carts/${cart.uuid}?type=set&quantity=${quantity}`)
      .then((response) => {
        console.log(response);
        this.setState({
          ...this.state,
          carts: response.data.cart,
          loading: false,
        });
      });
  };
  onChange = (e, cart) => {
    e.preventDefault();
    var new_carts = [...this.state.carts];
    var index = new_carts.findIndex((element) => {
      console.log("THIS IS ELEMENT", element);
      console.log("THIS IS CART", cart);
      return element.product_id == cart.product_id;
    });
    var value = parseInt(e.target.value);
    if (value == NaN) {
      value = 1;
    }

    console.log("THIS IS INDEX #{index}", index);
    new_carts[index].quantity = value;
    this.setState({
      ...this.state,
      carts: [...new_carts],
    });
  };
  cartSubTotal = () => {
    var total = 0;
    this.state.carts.map((cart) => {
      total += cart.product.price * (cart.quantity || 1);
    });
    return total;
  };
  getTax = () => {
    var total = 0;
    // this.state.carts.map((cart) => {
    //     total += cart.product.price * (cart.quantity || 1)
    // })
    return total;
  };
  cartTotal = () => {
    var total = this.cartSubTotal() + this.cartDeliveryCost() + this.getTax();
    return total;
  };

  cartDeliveryCost = () => {
    return 0;
  };

  removeFromCart = (cart) => {
    if (this.context.loggedIn()) {
      console.log("Removing from Cart", cart);
      axiosInstance.delete(`/v1/users/carts/${cart.uuid}`).then((response) => {
        console.log(response);
        if (response.status == 200) {
          this.setState({
            ...this.state,
            carts: response.data.cart,
          });
          this.context.setCart(response.data.cart);
        }
      });
    } else {
      var carts = this.state.carts;

      var index = carts.findIndex((c) => {
        return c.product_id == cart.product_id;
      });

      carts.splice(index, 1);

      this.setState({
        ...this.state,
        carts: carts,
      });
      localStorage.setItem("cart", JSON.stringify(carts));
      this.context.setCart(cart);
    }
  };

  render() {
    return (
      <>
        <Head>
          <title>My Cart</title>
        </Head>
        <Col className="topSide" md={12}>
          <h1>My Cart</h1>
        </Col>

        {this.state.loading ? (
          <FullLoadingWidget loading={this.state.loading} />
        ) : (
          <Col className={`pageContent ${styles.wrapper}`} md={12}>
            <Row>
              {!_.isEmpty(this.state.carts) ? (
                <Col md={9}>
                  <Table bordered={true} striped={true}>
                    <thead>
                      <th width="70%">Item</th>
                      <th width="10%" className="centered">
                        Price (GHS)
                      </th>
                      <th width="10%" className="centered">
                        Quantity
                      </th>
                      <th width="10%" className="centered">
                        Sub Total (GHS)
                      </th>
                    </thead>
                    <tbody>
                      {this.state.carts.map((cart) => {
                        return (
                          <tr>
                            <td>
                              <div className={styles.productPhoto}>
                                <img src={cart.product.featured_photo} />
                              </div>
                              <div className={styles.productName}>
                                <Link href={`/products/${cart.product.slug}`}>
                                  <a>
                                    <h5>{cart.product.name}</h5>
                                  </a>
                                </Link>
                                <p>
                                  <b>
                                    Color:{" "}
                                    {cart.color_name ? cart.color_name : "N/A"}{" "}
                                  </b>{" "}
                                  |{" "}
                                  <b>
                                    Size:{" "}
                                    {cart.size_name ? cart.size_name : "N/A"}{" "}
                                  </b>
                                </p>

                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.removeFromCart(cart);
                                  }}
                                >
                                  Remove Item
                                </Button>
                              </div>
                            </td>
                            <td className="right ">
                              <b>
                                <NumberField value={cart.product.price} />
                              </b>
                            </td>
                            <td className="centered ">
                              <ItemQuantityWidget
                                cart={cart}
                                quantity={cart.quantity}
                                size="sm"
                                addQuantity={this.addQuantity}
                                setQuantity={this.setQuantity}
                                reduceQuantity={this.reduceQuantity}
                                onChange={this.onChange}
                              />
                            </td>
                            <td className="right ">
                              <b>
                                <NumberField
                                  value={cart.product.price * cart.quantity}
                                />
                              </b>
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={3}>
                          <b>Sub Total</b>
                        </td>
                        <td className="right">
                          <b>
                            <NumberField value={this.cartSubTotal()} />
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              ) : (
                this.emptyCart()
              )}
              <Col md={3}>
                <Col md={12} className={styles.summaryBox}>
                  <FullLoadingWidget loading={this.state.loading} />
                  <h4>Summary</h4>
                  <Table bordered={false} striped={true}>
                    <tbody>
                      <tr>
                        <td>
                          <b>Sub Total</b>
                        </td>
                        <td className="right">
                          <b>
                            GHS <NumberField value={this.cartSubTotal()} />
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>Tax</b>
                          <br />
                          <small> </small>
                        </td>
                        <td className="right">
                          <b>
                            GHS <NumberField value={this.getTax()} />
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>Shipping</b>
                          <br />
                          <small>(Determined at checkout) </small>
                        </td>
                        <td className="right">
                          <b>
                            GHS <NumberField value={this.cartDeliveryCost()} />
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>Order Total</b>
                        </td>
                        <td className="right">
                          <b>
                            GHS <NumberField value={this.cartTotal()} />
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Row>
                    <Col md={12}>
                      {!this.context.loggedIn() ? (
                        <p className="centered" style={{ color: "red" }}>
                          <small>
                            You need to login / Signup Before you can checkout
                          </small>
                        </p>
                      ) : (
                        ""
                      )}
                      <Link
                        href={
                          this.context.loggedIn()
                            ? `/checkout`
                            : "/login?ref=checkout"
                        }
                      >
                        <Button
                          size={"lg"}
                          color={"success"}
                          className="form-control full-width"
                          // disabled={
                          //   !this.context.loggedIn() ||
                          //   _.isEmpty(this.state.carts)
                          // }
                        >
                          {" "}
                          Proceed to Checkout{" "}
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </Col>
              </Col>
            </Row>
          </Col>
        )}
      </>
    );
  }

  emptyCart = () => {
    return (
      <Col md={9} className="h-400">
        <Row className={"h-100 justify-content-md-center align-items-center"}>
          <Col className="centered">
            <img
              src="/images/empy_cart.png"
              alt="Steaman Online Logo"
              className={styles.cart_img}
            />
            <h1>Your cart is empty</h1>
            <p>&nbsp;</p>
            <Link href="/">
              <a>
                <Button color="success">Continue Shopping</Button>
              </a>
            </Link>
          </Col>
        </Row>
      </Col>
    );
  };
}
