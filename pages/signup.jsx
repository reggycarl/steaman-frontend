import Axios from "axios";
import Head from "next/head";
import React, { Component } from "react";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../styles/auth.module.scss";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { baseurl } from "../misc/Axios";
import ScaleLoader from "react-spinners/ScaleLoader";
import _ from "lodash";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      isVerified: false,
    };

    this.state = {
      visible: false,
    };
    this.handleonChange = this.handleonChange.bind(this);
  }
  handleonChange(value) {
    console.log("Captcha value:", value);
    this.setState({ isVerified: true });
  }
  state = {
    first_name: "",
    email: "",
    last_name: "",
    password: "",
    password_confirmation: "",
    phone: "",
    loading: false,
    account_created: false,
    errors: [],
  };
  signUp = (e) => {
    console.log("SIGNING UP");
    e.preventDefault();
    this.setState({
      loading: true,
    });
    Axios.post(baseurl + "/accounts/", {
      referral_code_number: this.state.referral_code_number,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
      phone: this.state.phone,
    })
      .then((response) => {
        console.log("THIS IS THE ERRORS", response);

        if (response.status == 200) {
          this.setState({
            ...this.state,
            account_created: true,
            ...response.data.data,
          });
        }
      })
      .catch((error) => {
        var errors = error.response.data.errors.full_messages;
        this.setState({
          ...this.state,
          loading: false,
          errors: errors,
        });
      });
  };
  onChange = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
      errors: [],
    });
  };
  onPhoneChanged = (number) => {
    console.log(number);
    this.setState({
      ...this.state,
      ...this.state.request,
      phone: number,
    });
  };
  render() {
    return (
      <>
        <Head>
          <title>Signup</title>
        </Head>
        <Col md={12}>
          <Row
            className={`justify-content-md-center align-items-center h-100 ${styles.wrapper}`}
          >
            <Col md={6} className="signupContainer">
              {this.state.account_created
                ? this.accountCreated()
                : this.loginForm()}
            </Col>
          </Row>
        </Col>
      </>
    );
  }

  loginForm = () => {
    return (
      <Form>
        <h3>Sign up</h3>
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
              value={this.state.first_name}
              placeholder="First Name"
              onChange={this.onChange}
              readOnly={this.state.loading}
            />
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label for="name">Last Name</Label>
            <Input
              type="text"
              name="last_name"
              value={this.state.last_name}
              placeholder="Last Name"
              onChange={this.onChange}
              readOnly={this.state.loading}
            />
          </FormGroup>
        </Row>
        <Row>
          <FormGroup className="col-md-6">
            <Label for="name">Email</Label>
            <Input
              type="email"
              name="email"
              value={this.state.email}
              placeholder="user@email.com"
              onChange={this.onChange}
              readOnly={this.state.loading}
            />
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label for="name">Phone</Label>
            <PhoneInput
              country={"gh"}
              value={this.state.phone}
              countryCodeEditable={false}
              specialLabel=""
              // disableCountryCode={true}

              disableDropdown={true}
              disabled={this.state.loading}
              className=""
              onChange={(phone) => this.onPhoneChanged(phone)}
            />
          </FormGroup>
        </Row>

        <Row>
          <FormGroup className="col-md-6 input-group with-focus margin-top-10">
            <Label for="name" className="input-group">
              Password
            </Label>
            <Input
              type={this.state.showPassword ? "text" : "password"}
              name="password"
              value={this.state.password}
              placeholder="********"
              onChange={this.onChange}
              readOnly={this.state.loading}
            />
            <i
              className="input-group-text bg-transparent"
              onClick={() =>
                this.setState({
                  showPassword: !this.state.showPassword,
                })
              }
            >
              {this.state.showPassword ? <FaEye /> : <FaEyeSlash />}
            </i>
          </FormGroup>
          <FormGroup className="col-md-6 input-group with-focus ">
            <Label for="name" className="input-group">
              Confirm Password
            </Label>
            <Input
              type={this.state.visible ? "text" : "password"}
              name="password_confirmation"
              value={this.state.password_confirmation}
              placeholder="********"
              onChange={this.onChange}
              readOnly={this.state.loading}
            />
            <i
              className="input-group-text bg-transparent"
              onClick={() =>
                this.setState({
                  visible: !this.state.visible,
                })
              }
            >
              {this.state.visible ? <FaEye /> : <FaEyeSlash />}
            </i>
          </FormGroup>
        </Row>
        <Row>
          <FormGroup className="col-md-6">
            <Label for="examplePassword">Referral Code</Label>
            <Input
              type="text"
              name="referral_code_number"
              id="referral_code_number"
              value={this.props.referral_code_number}
              onChange={this.onChange}
              placeholder="Referral Code"
            />
          </FormGroup>
        </Row>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RCAPTURE_SITE_KEY}
          onChange={this.handleonChange}
        />
        <button
          className="btn btn-block btn-success mt-3"
          type="submit"
          onClick={this.signUp}
          disabled={this.state.loading}
          disabled={!this.state.isVerified}
        >
          {this.state.loading ? (
            <React.Fragment>
              <ScaleLoader
                sizeUnit={"px"}
                height={10}
                color={"#fff"}
                loading={this.state.loading}
              />{" "}
            </React.Fragment>
          ) : (
            "Create My Account"
          )}{" "}
        </button>
        <p>&nbsp;</p>
        <p>
          Already Have an Account? <Link href="/login"> Login </Link>
        </p>
      </Form>
    );
  };

  accountCreated = () => {
    return (
      <Col>
        <h3>Hello {this.state.first_name},</h3>
        <p className="centered">
          Your account has been successfully created. Click the button below to
          login
        </p>
        <div className="centered">
          <Link href="/login">
            <Button color="success">Login</Button>
          </Link>
        </div>

        <p className="hidden">
          Your Account has been successfully created. A confimation Email has
          been sent to your email address {this.state.email}. Kindly confirm
          your account via the email.
        </p>
        <p className="hidden">Thank you.</p>
      </Col>
    );
  };
}
