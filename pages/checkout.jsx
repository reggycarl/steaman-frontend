import Head from "next/head";
import React, { Component } from "react";
import styles from "../styles/cart.module.scss";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  FormGroup,
  Label,
  Row,
  Input,
  Table,
  Button,
  InputGroup,
  Form,
} from "reactstrap";
import Select from "../components/CustomSelect";
import axiosInstance from "../misc/Axios";
import Axios from "axios";
import { getCities, getDeliveryMethods, getRegions } from "../misc/Functions";
import FullLoadingWidget from "../components/FullLoadingWidget/FullLoadingWidget";
import NumberField from "../misc/NumberField";
import Link from "next/link";
import PickupLocationsModal from "../components/Modals/PickupLocationModal";
import _ from "lodash";
import PickupLocationWidget from "../components/PickupLocationWidget/PickupLocationWidget";
import ShippingAddressesModal from "../components/Modals/ShippingAddressesModal";
import NewShippingAddressModal from "../components/Modals/NewShippingAddressModal";
import AddressWidget from "../components/AddressWidget";
import UserContext from "../components/UserContext";
import { FaCheckCircle } from "react-icons/fa";
import Router from "next/router";

import LoadingWidget from "../components/LoadingWidget";
export default class Checkout extends Component {
  static contextType = UserContext;
  state = {
    order: {
      shipping_address: {},
      shipping_address_id: null,
      discount_amount: 0,
    },
    carts: [],
    payment_channels: [],
    delivery_methods: [],
    address: {},
    address_id: null,
    regions: [],
    addresses: [],
    showShippingAddressModal: false,
    showNewShippingAddressModal: false,
    orderSuccess: false,
    placingOrder: false,
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,

      order: {
        ...this.state.order,
        [selectedOption]: val.value,
      },
      [selectedOption]: val,
    };
    this.setState({ ...state });
  };
  componentDidMount = () => {
    axiosInstance.get("/v1/users/carts?with_product=true").then((response) => {
      console.log(response.data);
      this.setState({
        ...this.state,
        carts: response.data.cart,
      });
    });
    axiosInstance.get("/v1/users/shipping_addresses").then((response) => {
      if (response.status == 200) {
        this.setState({
          ...this.state,
          addresses: response.data.data,
          order: {
            ...this.state.order,
            shipping_address_id:
              response.data.data.length > 0 ? response.data.data[0].id : null,
            shipping_address:
              response.data.data.length > 0 ? response.data.data[0] : null,
          },
        });
      }
    });
    getDeliveryMethods().then((response) => {
      console.log("DELIVERY METHODS FROM FXN", response);

      this.setState({
        ...this.state,
        delivery_methods: response,
      });
    });
    axiosInstance.get("/v1/payment_channels").then((response) => {
      console.log("Payment channels", response);
      if (response.status == 200) {
        this.setState({
          ...this.state,
          payment_channels: response.data.data,
        });
      }
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
    var total =
      this.cartSubTotal() +
      this.cartDeliveryCost() +
      this.getTax() -
      this.state.order.discount_amount;
    return total;
  };

  cartDeliveryCost = () => {
    return parseFloat(this.state.order.delivery_fee || 0);
  };
  toggleShippingAddressModal = () => {
    this.setState({
      ...this.state,
      showShippingAddressModal: !this.state.showShippingAddressModal,
      showNewShippingAddressModal: false,
    });
  };

  toggleNewShippingAddressModal = () => {
    this.setState({
      ...this.state,
      showShippingAddressModal: false,
      showNewShippingAddressModal: !this.state.showNewShippingAddressModal,
    });
  };

  selectPickupLocation = (location) => {
    console.log(location);
  };

  onCheckBoxChange = (e) => {
    console.log(e);
    console.log(e.target.name);
    console.log(e.target.value);
    var new_state = { ...this.state };
    if (e.target.name == "delivery_method_id" && e.target.value != null) {
      console.log("SETTING DELIVERY FEE ");
      var delivery_method = this.state.delivery_methods.find((add) => {
        return add.value == e.target.value;
      });
      console.log("This is method", delivery_method.default_delivery_fee);
      new_state = {
        ...new_state,
        order: {
          ...new_state.order,
          delivery_fee: delivery_method.default_delivery_fee,
        },
      };
    }
    // if (e.target.name == "payment_channel_id" && e.target.value != null) {
    //   console.log("setting Payment Channel   ");
    //   var payment_channel = this.state.payment_channels.find((add) => {
    //     return add.value == e.target.value;
    //   });
    //   console.log("This is threshold", payment_channel.threshold);
    //   new_state = {
    //     ...new_state,
    //     order: {
    //       ...new_state.order,
    //       delivery_fee: delivery_method.default_delivery_fee,
    //     },
    //   };
    // }
    new_state = {
      ...new_state,
      order: {
        ...new_state.order,
        [e.target.name]: e.target.value,
      },
    };
    console.log("THIS IS NEW STATE", new_state);
    this.setState({
      ...new_state,
    });
  };
  setAddresses = (addresses) => {
    this.setState({
      ...this.state,
      addresses: [...addresses],
    });
  };
  setAddressesWithAddress = (address, addresses) => {
    this.setState({
      ...this.state,
      addresses: [...addresses],
      order: {
        ...this.state.order,
        shipping_address_id: address.id,
        shipping_address: address,
      },
      showNewShippingAddressModal: false,
    });
  };
  selectPickupLocation = (pickup_location) => {
    console.log("THIS IS LOCATION", pickup_location);
    if (!_.isEmpty(pickup_location)) {
      console.log("SETTING LOCATION", pickup_location);
      this.setState({
        ...this.state,
        showPickupLocationModal: false,
        order: {
          ...this.state.order,
          pickup_location_id: pickup_location.id,
          pickup_location: pickup_location,
        },
      });
    }
  };
  togglePickupLocationsModal = () => {
    this.setState({
      ...this.state,
      showPickupLocationModal: !this.state.showPickupLocationModal,
    });
  };
  selectShippingAddress = (address) => {
    console.log("THIS IS SELECTED ADDRESS", address);
    this.setState({
      ...this.state,
      showShippingAddressModal: false,
      order: {
        ...this.state.order,
        shipping_address_id: address.id,
        shipping_address: address,
      },
    });
  };

  onChange = (e) => {
    console.log(e);
    this.setState({
      ...this.state,
      order: {
        ...this.state.order,
        [e.target.name]: e.target.value,
      },
    });
  };

  placeOrder = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      placingOrder: true,
    });
    axiosInstance
      .post("/v1/users/orders", { order: this.state.order })
      .then((response) => {
        if (response.status == 200) {
          this.context.setCart(response.data.carts);
          if (response.data.payment) {
            if (
              response.data.payment.fw_payment_link != null &&
              response.data.payment.fw_payment_link != ""
            ) {
              Router.push(`${response.data.payment.fw_payment_link}`);
            }
            this.setState({
              ...this.state,
              orderSuccess: true,
              carts: response.data.carts,
            });
          } else {
            this.setState({
              ...this.state,
              orderSuccess: true,
              carts: response.data.carts,
            });
          }
        }
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          placingOrder: false,
        });
      });
  };
  validateRefferralCode = () => {
    console.log("Applcing  Referrer", this.state.order.referral_code);
    axiosInstance
      .get(`/v1/vouchers/get_referrer?code=${this.state.order.referral_code}`, {
        order: this.state.order,
      })
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          var referrer = response.data.referrer;

          this.setState({
            ...this.state,
            order: {
              ...this.state.order,
              referrer_id: referrer.id,
            },
          });
        }
      });
  };

  redeemVoucher = () => {
    console.log("REDEEMING VOUCHER", this.state.order.voucher_code);
    axiosInstance
      .get(`/v1/vouchers/${this.state.order.voucher_code}`, {
        order: this.state.order,
      })
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          var voucher = response.data.voucher;
          var voucher_amount =
            voucher.amount > 0
              ? voucher.amount
              : (voucher.rate * this.cartSubTotal()) / 100;
          this.setState({
            ...this.state,
            order: {
              ...this.state.order,
              voucher_id: voucher.id,
              discount_amount: voucher_amount,
            },
          });
        }
      });
  };

  render() {
    return (
      <>
        <Head>
          <title>Checkout</title>
        </Head>
        <PickupLocationsModal
          isOpen={this.state.showPickupLocationModal}
          selectPickupLocation={this.selectPickupLocation.bind(this)}
          toggle={this.togglePickupLocationsModal}
          parentForm={this}
        />
        <ShippingAddressesModal
          isOpen={this.state.showShippingAddressModal}
          selectShippingAddress={this.selectShippingAddress.bind(this)}
          shipping_address_id={this.state.order.shipping_address_id}
          toggle={this.toggleShippingAddressModal}
          toggleNewShippingAddressModal={this.toggleNewShippingAddressModal}
          addresses={this.state.addresses}
          parentForm={this}
        />
        <NewShippingAddressModal
          isOpen={this.state.showNewShippingAddressModal}
          setAddresses={this.setAddresses}
          setAddressesWithAddress={this.setAddressesWithAddress}
          selectShippingAddress={this.selectShippingAddress.bind(this)}
          toggle={this.toggleNewShippingAddressModal}
          parentForm={this}
        />
        <Col className="topSide" md={12}>
          <h1>Checkout</h1>
        </Col>
        <Col md={12}>
          <Row>
            {this.state.orderSuccess ? (
              <Col md={12} className={`${styles.orderSuccessBox} `}>
                <FaCheckCircle size={50} color="green" />
                <p>&nbsp;</p>
                <h3>Order Successfully Placed</h3>
                <Link href="/">
                  <Button color="success">Continue Shopping</Button>
                </Link>
              </Col>
            ) : (
              <>
                <Col md={4}>
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <h4>Shipping Address</h4>
                      </CardTitle>
                      <CardText>
                        <Row>
                          <FormGroup className="col-md-12">
                            <div className={styles.addressBox}>
                              <div
                                className={"inner"}
                                onClick={
                                  this.state.placingOrder
                                    ? null
                                    : this.toggleShippingAddressModal
                                }
                              >
                                {!_.isEmpty(
                                  this.state.order.shipping_address
                                ) ? (
                                  <AddressWidget
                                    address={this.state.order.shipping_address}
                                  />
                                ) : (
                                  <div className="centered">
                                    <p>
                                      &nbsp; <br />
                                      No Address Selected <br />
                                      Click to Select An Address
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </FormGroup>
                        </Row>
                        <Button
                          onClick={this.toggleNewShippingAddressModal}
                          color={"secondary"}
                          disabled={this.state.placingOrder}
                          className="form-control"
                        >
                          Add New Address
                        </Button>
                      </CardText>
                    </CardBody>
                  </Card>

                  <Card className={styles.deliveryMethodCard}>
                    <CardBody>
                      <CardTitle>
                        <h4>Delivery Method</h4>
                      </CardTitle>
                      <CardText>
                        <Col md={12}>
                          {this.state.delivery_methods.map(
                            (delivery_method) => {
                              return (
                                <>
                                  <FormGroup md={12}>
                                    <Label check>
                                      <Input
                                        type="radio"
                                        name="delivery_method_id"
                                        disabled={this.state.placingOrder}
                                        value={delivery_method.value}
                                        className={"custom"}
                                        onChange={this.onCheckBoxChange}
                                      />{" "}
                                      {delivery_method.label}
                                    </Label>
                                  </FormGroup>
                                  <p>
                                    Delivery Fee: GHS{" "}
                                    <NumberField
                                      value={
                                        delivery_method.default_delivery_fee
                                      }
                                    />{" "}
                                    <br />
                                    <p>
                                      Delivery Duration:{" "}
                                      {delivery_method.default_duration}
                                    </p>
                                  </p>
                                  {this.state.order.pickup_location &&
                                  delivery_method.code == "PDC" ? (
                                    <PickupLocationWidget
                                      pickup_location={
                                        this.state.order.pickup_location
                                      }
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {this.state.order.delivery_method_id == "2" &&
                                  delivery_method.code == "PDC" ? (
                                    <Button
                                      className="form-control"
                                      disabled={this.state.placingOrder}
                                      onClick={this.togglePickupLocationsModal}
                                    >
                                      Select Pickup Location
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }
                          )}
                        </Col>
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={4} className={styles.payment_channels}>
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <h4>Payment Method</h4>
                      </CardTitle>
                      <CardText>
                        <Col md={12}>
                          {this.state.payment_channels.map(
                            (payment_channel) => {
                              return (
                                <>
                                  <FormGroup
                                    md={12}
                                    className={
                                      styles.payment_channel_form_group
                                    }
                                  >
                                    <Label check>
                                      <Input
                                        type="radio"
                                        name="payment_channel_id"
                                        value={payment_channel.id}
                                        className={"custom"}
                                        disabled={
                                          this.state.placingOrder ||
                                          (payment_channel.threshold <=
                                            this.cartSubTotal() &&
                                            payment_channel.threshold > 0)
                                        }
                                        readOnly={this.state.placingOrder}
                                        onChange={this.onCheckBoxChange}
                                      />{" "}
                                      {payment_channel.name}{" "}
                                      {payment_channel.threshold <=
                                        this.cartSubTotal() &&
                                      payment_channel.threshold > 0 ? (
                                        <>
                                          <br />
                                          <span>
                                            <small>
                                              Orders above GHS GHS{" "}
                                              <NumberField
                                                value={
                                                  payment_channel.threshold
                                                }
                                              />{" "}
                                              cannot be placed using this method
                                            </small>{" "}
                                          </span>
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </Label>
                                    {this.state.order.payment_channel_id ==
                                      payment_channel.id &&
                                    payment_channel.notes ? (
                                      <p
                                        className={styles.payment_channel_notes}
                                      >
                                        {payment_channel.notes}
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                    {this.state.order.payment_channel_id ==
                                      payment_channel.id &&
                                    payment_channel.fields
                                      ? payment_channel.fields
                                          .split(",")
                                          .map((field) => {
                                            var [name, type] = field.split("|");
                                            return (
                                              <FormGroup className>
                                                <Label
                                                  className={
                                                    styles.wallet_label
                                                  }
                                                >
                                                  {name
                                                    .replace("_", " ")
                                                    .replace(/\b\w/g, (l) =>
                                                      l.toUpperCase()
                                                    )}{" "}
                                                </Label>
                                                <Input
                                                  disabled={
                                                    this.state.placingOrder
                                                  }
                                                  readOnly={
                                                    this.state.placingOrder
                                                  }
                                                  type="tel"
                                                  name={name}
                                                  placeholder="0212345678"
                                                  value={this.state.order[name]}
                                                  onChange={this.onChange}
                                                />
                                              </FormGroup>
                                            );
                                          })
                                      : ""}
                                    <Form>
                                      <a
                                        class="ttlr_inline"
                                        data-APIKey="Your API Key"
                                        data-transid="000000000000"
                                        data-amount="1"
                                        data-customer_email="email@customer.com"
                                        data-currency="GHS"
                                        data-redirect_url="https://steaman.com.gh"
                                        data-pay_button_text="Pay Now"
                                        data-custom_description="Payment Using InlineJS"
                                        data-payment_method="card"
                                      ></a>
                                    </Form>
                                  </FormGroup>
                                </>
                              );
                            }
                          )}
                        </Col>
                      </CardText>
                    </CardBody>
                  </Card>

                  <Card className={styles.deliveryMethodCard}>
                    <CardBody>
                      <CardTitle>
                        <h4>Redeem Vouchers &amp; Discount Codes</h4>
                      </CardTitle>
                      <CardText>
                        <Row>
                          <InputGroup className="col-md-12">
                            <Input
                              type="text"
                              name="voucher_code"
                              placeholder="Enter your voucher or Discount code"
                              value={this.state.order.voucher_code}
                              onChange={this.onChange}
                              disabled={this.state.order.voucher_id}
                            />
                            <div class="input-group-append">
                              <Button
                                onClick={this.redeemVoucher}
                                color={"secondary"}
                                disabled={
                                  this.state.placingOrder ||
                                  this.state.order.voucher_id
                                }
                                className="form-control"
                              >
                                Redeem
                              </Button>
                            </div>
                          </InputGroup>
                        </Row>
                        <Row>
                          <Col>
                            <h5>Voucher Value</h5>
                          </Col>
                          <Col className={"right"}>
                            <h5>
                              GHS{" "}
                              <NumberField
                                value={this.state.order.discount_amount || 0}
                              />
                            </h5>
                          </Col>
                        </Row>
                      </CardText>
                    </CardBody>
                  </Card>
                  <Card className={styles.deliveryMethodCard}>
                    <CardBody>
                      <CardTitle>
                        <h4>Refferal Code</h4>
                      </CardTitle>
                      <CardText>
                        <Row>
                          <InputGroup className="col-md-12">
                            <Input
                              type="text"
                              name="referral_code"
                              placeholder="Enter your referrer's code"
                              value={this.state.order.referral_code}
                              onChange={this.onChange}
                              disabled={this.state.order.referrer_id}
                            />
                            <div class="input-group-append">
                              <Button
                                onClick={this.validateRefferralCode}
                                color={"secondary"}
                                disabled={
                                  this.state.placingOrder ||
                                  this.state.order.referrer_id
                                }
                                className="form-control"
                              >
                                Validate
                              </Button>
                            </div>
                          </InputGroup>
                        </Row>
                        {/* <Row>
                          <Col>
                            <h5>Referral Discount</h5>
                          </Col>
                          <Col className={"right"}>
                            <h5>
                              GHS{" "}
                              <NumberField
                                value={this.state.order.discount_amount || 0}
                              />
                            </h5>
                          </Col>
                        </Row> */}
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <h4>Order Review</h4>
                      </CardTitle>
                      <CardText>
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
                                    GHS{" "}
                                    <NumberField value={this.cartSubTotal()} />
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
                                  <b>Discounts</b>
                                  <br />
                                  {/* <small>(Determined at checkout) </small> */}
                                </td>
                                <td className="right">
                                  <b>
                                    ( GHS{" "}
                                    <NumberField
                                      value={
                                        this.state.order.discount_amount || 0
                                      }
                                    />
                                    )
                                  </b>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Shipping</b>
                                  <br />
                                  {/* <small>(Determined at checkout) </small> */}
                                </td>
                                <td className="right">
                                  <b>
                                    GHS{" "}
                                    <NumberField
                                      value={this.cartDeliveryCost()}
                                    />
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
                              <Link href="/checkout">
                                <Button
                                  size={"lg"}
                                  color={"success"}
                                  className="form-control full-width"
                                  disabled={this.state.placingOrder}
                                  onClick={this.placeOrder}
                                >
                                  {this.state.placingOrder ? (
                                    <LoadingWidget color="#fff" />
                                  ) : (
                                    "Place Order"
                                  )}
                                </Button>
                              </Link>
                            </Col>
                          </Row>
                        </Col>
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>{" "}
              </>
            )}
          </Row>
        </Col>
      </>
    );
  }
}
