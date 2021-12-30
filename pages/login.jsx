import React, { Component } from "react";
import Head from "next/head";
import styles from "../styles/auth.module.scss";
import { Button, Col, Form, Input, Row } from "reactstrap";
import Layout from "../misc/Layout";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance, { baseurl, errorMessages } from "../misc/Axios";
import UserContext from "../components/UserContext";
import Link from "next/link";
import Router from "next/router";
import qs from "query-string";
import Axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import Image from "next/image";
import { toast } from "react-toastify";
import LoadingWidget from "../components/LoadingWidget";

class Login extends Component {
  static contextType = UserContext;

  state = {
    email: "",
    password: "",
    hasError: {},
    loading: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      isVerified: false,
    };
    this.handleonChange = this.handleonChange.bind(this);
  }

  handleonChange(value) {
    console.log("Captcha value:", value);
    this.setState({ isVerified: true });
  }

  componentDidMount = () => {
    if (this.context.loggedIn()) {
      Router.push("/");
    }

    // console.log("THIS IS CONTEXT PRESENT from", this.context)
  };

  hasError = () => {};
  validateOnChange = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };
  login = (e) => {
    e.preventDefault();
    // UserContext.signIn(this.state.email, this.state.password);
    this.signIn(this.state.email, this.state.password);

    // this.props.user
    // this.context.signIn(this.state.email, this.state.password)
  };
  signIn = (username, password) => {
    var query_string = qs.parse(location.search);
    var ref = query_string.ref || "";
    this.setState({
      ...this.state,
      loading: true,
    });
    Axios.post(baseurl + "/accounts/sign_in", {
      email: username,
      password: password,
    })
      .then((response) => {
        console.log(response.data);
        if (response.status == 200) {
          var user = response.data.data;
          localStorage.setItem("steaman-user", JSON.stringify(user));
          localStorage.setItem(
            "steaman-access-token",
            response.headers["access-token"]
          );
          localStorage.setItem("steaman-uid", response.headers["uid"]);
          localStorage.setItem("steaman-client", response.headers["client"]);
          console.log("THIS IS HEADER", response.headers);
          var current_carts = localStorage.getItem("cart");
          if (current_carts != null && current_carts != "") {
            current_carts = JSON.parse(current_carts);
            for (var index in current_carts) {
              console.log("THIS IS CURRENT CART IN SIGNIN", index);
              axiosInstance
                .post("/v1/users/carts", { cart: current_carts[index] })
                .then((response) => {
                  console.log("THIS IS RESPONSE FROM CART", response.data);
                  if (response.status == 200) {
                    this.context.setCart(response.data.cart);
                  }
                });
            }
            localStorage.removeItem("cart");
          }
          toast.success(" Logged In");
          this.context.setUser(user, ref);
          //   this.setState({
          //       ...this.state,
          //       loading: false
          //   })
        } else {
          toast.success("An Error Occured");
          this.setState({
            ...this.state,
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.log("ERROR", error.response);
        toast.error(errorMessages(error.response.data));
        this.setState({
          ...this.state,
          loading: false,
        });
      });
  };

  render() {
    return (
      <>
        <Head>
          <title>Login </title>
        </Head>
        <Col md={12}>
          <Row className={styles.wrapper}>
            <Col md={6} className="d-none d-sm-block">
              <Row>
                <Image
                  height="700"
                  width="700"
                  layout="responsive"
                  src={"/images/welcome_shopper.jpg"}
                />
              </Row>
            </Col>
            <Col md={6} className=" loginBox">
              <Row className="justify-content-md-center align-items-center h-100">
                <Col md={8} className="loginContainer">
                  <Form>
                    <h3>Login</h3>
                    <div className="form-group">
                      <div className="input-group with-focus">
                        <input
                          type="hidden"
                          name="email"
                          className={"hidden"}
                          value="sdfldskf"
                        />
                        <div className="input-group-prepend">
                          <span className="input-group-text text-muted bg-transparent border-left-1">
                            <FaEnvelope />
                          </span>
                        </div>
                        <Input
                          type="text"
                          name="email"
                          className="border-right-1"
                          placeholder="Enter Email"
                          // invalid={this.hasError('formLogin', 'email', 'required') || this.hasError('formLogin', 'email', 'email')}
                          onChange={this.validateOnChange}
                          // placeholder="user@email.com"
                          data-validate='["required"]'
                          disabled={this.state.loading}
                          value={this.state.email}
                        />

                        {this.hasError("formLogin", "email", "required") && (
                          <span className="invalid-feedback">
                            Field is required
                          </span>
                        )}
                        {this.hasError("formLogin", "email", "email") && (
                          <span className="invalid-feedback">
                            Field must be valid email
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group with-focus">
                        <input
                          type=""
                          name="password"
                          className={"hidden"}
                          value="password"
                        />
                        <div className="input-group-prepend">
                          <span className="input-group-text text-muted bg-transparent border-left-1 ">
                            <FaLock />
                          </span>
                        </div>
                        <Input
                          type={this.state.showPassword ? "text" : "password"}
                          id="id-password"
                          name="password"
                          className="border-right-0"
                          placeholder="Password"
                          invalid={this.hasError(
                            "formLogin",
                            "password",
                            "required"
                          )}
                          onChange={this.validateOnChange}
                          data-validate='["required"]'
                          onCopy={this.handleCopyPaste}
                          onCut={this.handleCopyPaste}
                          onPaste={this.handleCopyPaste}
                          autoComplete=""
                          disabled={this.state.loading}
                          value={this.state.password}
                        />
                        <span
                          className="input-group-text bg-transparent"
                          onClick={() =>
                            this.setState({
                              showPassword: !this.state.showPassword,
                            })
                          }
                        >
                          {this.state.showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>

                        <span className="invalid-feedback">
                          Field is required
                        </span>
                      </div>
                    </div>
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RCAPTURE_SITE_KEY}
                      onChange={this.handleonChange}
                    />
                    ,
                    <button
                      className="btn btn-block btn-success mt-3"
                      type="submit"
                      onClick={this.login}
                      disabled={this.state.loading}
                      disabled={!this.state.isVerified}
                    >
                      {this.state.loading ? (
                        <LoadingWidget color={"#fff"} />
                      ) : (
                        "Login"
                      )}{" "}
                    </button>
                    <p>&nbsp;</p>
                    <Row>
                      <Col md={6}>
                        <Link href="/reset-password">
                          <Button className="form-control">
                            Reset Your Password
                          </Button>
                        </Link>
                      </Col>
                      <Col md={6}>
                        <p>
                          Don't have an account?{" "}
                          <Link href="/signup">Signup</Link>
                        </p>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

// Login.contextType = UserContext;
// Login.contextType = UserContext;
export default Login;
// UserContext.contextType = UserContext;
// export default Login;
