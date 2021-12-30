import Head from "next/head";
import Router from "next/router";
import React, { Component } from "react";
import { FaCoins, FaMoneyBill } from "react-icons/fa";

import {
  Input,
  Card,
  CardText,
  Button,
  CardTitle,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import UserContext from "../components/UserContext";
import axiosInstance from "../misc/Axios";
import Layout from "../misc/Layout";
import NumberField from "../misc/NumberField";
import styles from "../styles/account.module.scss";
import ScaleLoader from "react-spinners/ScaleLoader";
import _ from "lodash";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import NewShippingAddressModal from "../components/Modals/NewShippingAddressModal";
import AddressWidget from "../components/AddressWidget";
import FullLoadingWidget from "../components/FullLoadingWidget/FullLoadingWidget";
import LoadingWidget from "../components/LoadingWidget";

export default class Account extends Component {
  static contextType = UserContext;
  
  
  
  state = {
    activeTab: "1",
    account: {
      shipping_addresses: [],
      payment_methods: [],
      newPassword:false,
      confPassword:false,
    },
    temp_account: {},
    updating: false,
    showNewShippingAddressModal: false,
    loading: false,
    load:false,
  };
 
  toggle = (val) => {
    this.setState({
      ...this.state,
      activeTab: val,
    });
  };
  onChange = (e) => {
    this.setState({
      ...this.state,
      temp_account: {
        ...this.state.temp_account,
        [e.target.name]: e.target.value,
      },

      errors: [],
    });
  };
  updateInformation = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      updating: true,
    });
    axiosInstance
      .put(`/v1/account/`, { account: this.state.temp_account })
      .then((response) => {
        console.log(response);
        this.setState({
          ...this.state,
          updating: true,
        });
        if (response.status == 200) {
          this.setState({
            ...this.state,
            account: {
              ...this.state.account,
              ...response.data.account,
            },
            temp_account: {
              ...this.state.temp_account,
              ...response.data.account,
            },
            updating: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          updating: false,
        });
      });
  };
  onPhoneChanged = (number) => {
    // console.log(number);
    this.setState({
      ...this.state,
      temp_account: {
        ...this.state.temp_account,
        phone: number,
      },
    });
  };
  ChangePassword =(e) =>{
    this.setState({
      load:true,
    })
    
    axiosInstance.put('/accounts/password', {
      password: this.state.temp_account.password,
      password_confirmation: this.state.temp_account.password_confirmation,
      
    })
    .then(function (response) {
      console.log(response);
      this.setState({
        ...this.state,
        load: false,
      });
    })
    .catch((error) => {
      this.setState({
        ...this.state,
        updating: false,
        load: false,
      });
    });
    console.log("checking information..." + this.state.password);
    
  };
  
  
  componentDidMount = () => {
    this.setState({
      ...this.state,
      loading: true,
    });
    if (!this.context.loggedIn()) {
      Router.push("/login");
    }
    axiosInstance.get("/v1/account").then((response) => {
      if (response.status == 200) {
        this.setState({
          ...this.state,
          account: {
            ...this.state.account,
            ...response.data.account,
          },
          temp_account: response.data.account,
          loading: false,
        });
      } else {
        this.setState({
          ...this.state,
          loading: false,
        });
      }
    });
  };
  toggleNewShippingAddressModal = () => {
    this.setState({
      ...this.state,
      showNewShippingAddressModal: !this.state.showNewShippingAddressModal,
    });
  };

  render() {
    return this.state.loading == true ? (
      <FullLoadingWidget loading={this.state.loading} />
    ) : (
      <>
        <NewShippingAddressModal
          isOpen={this.state.showNewShippingAddressModal}
          toggle={this.toggleNewShippingAddressModal}
          parentForm={this}
        />
        <Col className={styles.wrapper}>
          <Row>
            <Col md={12} className={"topSide"}>
              <h2>My Account</h2>
            </Col>
          </Row>
          <Row className="pageContent">
            <Col>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={this.state.activeTab == "1" ? "active" : ""}
                    onClick={() => {
                      this.toggle("1");
                    }}
                  >
                    My Steaman Account
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={this.state.activeTab == "2" ? "active" : ""}
                    onClick={() => {
                      this.toggle("2");
                    }}
                  >
                    Account Details
                  </NavLink>
                </NavItem>
                {/* <NavItem>
          <NavLink
            className={this.state.activeTab == '3' ? "active":  ''}
            onClick={() => { this.toggle('3'); }}
          >
            Payment Methods
          </NavLink>
        </NavItem> */}
                <NavItem>
                  <NavLink
                    className={this.state.activeTab == "4" ? "active" : ""}
                    onClick={() => {
                      this.toggle("4");
                    }}
                  >
                    Shipping Addresses
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    className={this.state.activeTab == "5" ? "active" : ""}
                    onClick={() => {
                      this.toggle("5");
                    }}
                  >
                    Change Password
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <Row className="row-eq-height">
                    <Col sm="6" className="card-container">
                      <Card body className="h-100">
                        <CardTitle>Account Details </CardTitle>
                        <CardText>
                          <p>{this.state.account.full_name}</p>
                          <p>{this.state.account.email}</p>
                          <p>{this.state.account.phone}</p>{" "}
                        </CardText>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            this.toggle("2");
                          }}
                          color="success"
                        >
                          Edit Account Information
                        </Button>
                      </Card>
                    </Col>
                    <Col sm="6" className="card-container">
                      <Card body>
                        <CardTitle>Shipping Addresses</CardTitle>
                        <CardText>
                          {this.state.account.shipping_addresses.length > 0 ? (
                            <Col className={styles.addressBox}>
                              <AddressWidget
                                address={
                                  this.state.account.shipping_addresses[0]
                                }
                              />
                            </Col>
                          ) : (
                            <Col className="centered">
                              <p>&nbsp;</p>
                              <p>
                                You Currenty don't have any saved Shipping
                                Address on your Account
                              </p>
                            </Col>
                          )}
                        </CardText>
                        <Button
                          color="success"
                          onClick={(e) => this.toggle("4")}
                        >
                          Add a Shipping Address
                        </Button>
                      </Card>
                    </Col>
                    <Col sm="6" className="card-container">
                      <Card body>
                        <CardTitle>SteamanPay Balance</CardTitle>
                        <CardText className="centered">
                          <h1 className={styles.balance}>
                            <FaMoneyBill size={30} color={"green"} /> GHS{" "}
                            <NumberField
                              value={this.state.account.account_balance || 0}
                            />
                          </h1>
                        </CardText>
                      </Card>
                    </Col>
                    <Col sm="6" className="card-container">
                      <Card body>
                        <CardTitle>Refferal Code &amp; Points</CardTitle>
                        <CardText className="centered">
                          <h1 className={styles.balance}>
                            <h6>Your referral Code</h6>
                            <h1 className="centered">
                              {this.state.account.referral_code}
                            </h1>
                            <h6>
                              <FaCoins size={10} /> You have earned{" "}
                              {this.state.account.points} points
                            </h6>
                            <Button
                              color="success"
                              disabled={this.state.account.points <= 0}
                            >
                              Redeem Your Points
                            </Button>
                          </h1>
                        </CardText>
                      </Card>
                    </Col>
                    {/* <Col sm="6" className='card-container'>
              <Card body>
                <CardTitle>Payment Methods</CardTitle>
                <CardText>{this.state.account.payment_methods.count > 0 ? "" : 
                <Col className='centered'>
                    <p>&nbsp;</p>
                <p>You Currenty don't have any saved Payment Methods  on your Account</p>
                </Col>}</CardText>
                <Button color="success" onClick={e => this.toggle("3")}>Add Payment Method</Button>
              </Card>
            </Col> */}
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col md={2}></Col>
                    <Col md={8}>{this.AccountForm()}</Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Col sm="6">Tab 3</Col>
                  </Row>
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                    <Col sm="12">{this.shippingAddresses()}</Col>
                  </Row>
                </TabPane>
                <TabPane tabId="5">{this.changePasswordForm()}</TabPane>
              </TabContent>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
  changePasswordForm() {
    return (
      <>
        <Row>
          <Col md="12">
            <Row>
              <FormGroup className="col-md-6 input-group with-focus">
                <Label for="name" className="input-group">New Password</Label>
               
                <Input
                          type={this.state.newPassword ? "text" : "password"}
                          name="password"
                          
                          placeholder="Enter Email"
                          onChange={this.onChange}
                          placeholder="********"
                          data-validate='["required"]'
                          disabled={this.state.load}
                          value={this.state.password}
                        />
                        <span
                          className="input-group-text bg-transparent"
                          onClick={() =>
                            this.setState({
                              newPassword: !this.state.newPassword,
                            })
                          }
                        >
                          {this.state.newPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>

                
              </FormGroup>
              <FormGroup className="col-md-6 input-group with-focus">
                <Label for="name"className="input-group">Confirm Password</Label>
                
                <Input
                          type={this.state.confPassword ? "text" : "password"}
                          name="password_confirmation"
                          
                          placeholder="Enter Email"
                          onChange={this.onChange}
                          placeholder="********"
                          data-validate='["required"]'
                          disabled={this.state.load}
                          value={this.state.password_confirmation}
                        />
                        <span
                          className="input-group-text bg-transparent"
                          onClick={() =>
                            this.setState({
                              confPassword: !this.state.confPassword,
                            })
                          }
                        >
                          {this.state.confPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>

              </FormGroup>
            </Row>
          </Col>
        </Row>
        <Col className="centered">
          <button
                      className="btn btn-block btn-success mt-3"
                      type="submit"
                      onClick={this.ChangePassword}
                      disabled={this.state.load}
                      disable={false}
                    >
                      {this.state.load ? (
                        <LoadingWidget color={"#fff"} />
                      ) : (
                        "Change Password"
                      )}{" "}
                    </button>
        </Col>
      </>
    );
  }
  shippingAddresses() {
    return (
      <>
        <h1>&nbsp;</h1>
        {!_.isEmpty(this.state.account.shipping_addresses) > 0 ? (
          this.state.account.shipping_addresses.map((address) => {
            return (
              <Col className={styles.addressBox}>
                <AddressWidget address={address} />
              </Col>
            );
          })
        ) : (
          <Col className="centered">
            <p>
              You currently Don't Have any shipping addresses on your profile{" "}
            </p>
          </Col>
        )}
        <Col className="centered">
          <Button color="success" onClick={this.toggleNewShippingAddressModal}>
            Add a Shipping Address
          </Button>
        </Col>
      </>
    );
  }

  AccountForm() {
    return (
      <Form>
        {!_.isEmpty(this.state.errors) ? (
          <div className="alert alert-danger ">
            <p>The Following Error Occured during account creation</p>
            <ul>
              {this.state.errors.map((error, i) => {
                return <li>{error}</li>;
              })}
            </ul>
          </div>
        ) : (
          ""
        )}
        <Row>
          <FormGroup className="col-md-6">
            <Label for="name">First Name</Label>
            <Input
              type="text"
              name="first_name"
              value={
                this.state.temp_account
                  ? this.state.temp_account.first_name
                  : ""
              }
              placeholder="First Name"
              onChange={this.onChange}
              readOnly={this.state.updating}
            />
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label for="name">Last Name</Label>
            <Input
              type="text"
              name="last_name"
              value={
                this.state.temp_account ? this.state.temp_account.last_name : ""
              }
              placeholder="First Name"
              onChange={this.onChange}
              readOnly={this.state.updating}
            />
          </FormGroup>
        </Row>
        <Row>
          <FormGroup className="col-md-6">
            <Label for="name">Email</Label>
            <Input
              type="email"
              name="email"
              value={
                this.state.temp_account ? this.state.temp_account.email : ""
              }
              placeholder="user@email.com"
              readOnly={true}
            />
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label for="name">Phone</Label>
            <PhoneInput
              country={"gh"}
              value={
                this.state.temp_account ? this.state.temp_account.phone : ""
              }
              countryCodeEditable={false}
              specialLabel=""
              // disableCountryCode={true}

              disableDropdown={true}
              disabled={this.state.updating}
              readOnly={this.state.updating}
              className=""
              onChange={(phone) => this.onPhoneChanged(phone)}
            />
          </FormGroup>
        </Row>

        <button
          className="btn btn-block btn-success mt-3"
          type="submit"
          onClick={this.updateInformation}
          disabled={this.state.updating}
        >
          {this.state.updating ? (
            <React.Fragment>
              <ScaleLoader
                sizeUnit={"px"}
                height={10}
                color={"#fff"}
                loading={this.state.updating}
              />{" "}
            </React.Fragment>
          ) : (
            "Update  My Account Information"
          )}{" "}
        </button>
      </Form>
    );
  }
}
