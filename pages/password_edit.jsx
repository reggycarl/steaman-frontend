import Head from "next/head";
import Link from "next/link";
import React, { Component } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios_original from "axios";
import { Col, Form, Row, Input, Button } from "reactstrap";
import styles from "../styles/auth.module.scss";
import { baseurl, errorMessages } from "../misc/Axios";
import LoadingWidget from "../components/LoadingWidget";
import { toast } from "react-toastify";
export default class ResetPassword extends Component {
  state = {
    password: "",
    password_confirmation: "",
    current_password: "",
    not_found: false,
    password_changed: false,
  };
  componentDidMount = () => {
    const params = new URLSearchParams(window.location.search);
    var show_confirmed = false;
    var reset_password_token = null;
    if (params.has("reset_password_token")) {
      reset_password_token = params.get("reset_password_token");
    }

    this.setState({
      ...this.state,
      reset_password_token: reset_password_token,
    });

    // axios_original.get(baseurl +"/partners/validate_token?auth_token="+reset_password_token+"&redirect_url=/sdfsdfs").then(response => {
    // console.log("THIS IS RESPONSE AFTER MOUNT", response)
    // })
  };

  onChange = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };

  changePassword = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      loading: true,
    });
    axios_original
      .put(baseurl + "/accounts/password", {
        password: this.state.password,
        password_confirmation: this.state.password_confirmation,
        reset_password_token: this.state.reset_password_token,
        client_reset_password_token: this.state.reset_password_token,
      })
      .then((response) => {
        //token: this.state.reset_password_token
        if (response.status == 200) {
          toast.success(response.data.message);
          this.setState({
            ...this.state,
            email: "",
            message: response.data.message,
            // loading: false,
            password_changed: true,
          });
        }
      })
      .catch((error) => {
        var not_found = false;
        console.log(error);
        console.log("RESPONSE CODE", error.response.data.errors);
        if (error.response.status == 401) {
          not_found = true;
          toast.error("Password Reset Failed. Invalid / Expired Token");
        } else {
          toast.error(errorMessages(error.response.data));
        }
        this.setState({
          ...this.state,
          resetting: false,
          loading: false,
          not_found: not_found,
        });
      });
  };
  render() {
    return (
      <>
        <Head>
          <title>Change Password </title>
        </Head>
        <Col md={12}>
          <Row className={styles.wrapper}>
            <Col md={12} className=" loginBox">
              <Row className="justify-content-md-center align-items-center h-100">
                <Col md={4} className="loginContainer">
                  <Form>
                    <h3>Change Password</h3>
                    {this.state.password_changed ? (
                      <h3 className="centered">{this.state.message}</h3>
                    ) : (
                      this.passwordEditForm()
                    )}

                    <p>&nbsp;</p>
                    <Row>
                      <Col md={6}>
                        <Link href="/login">
                          <Button className="form-control" color="success">
                            Login
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
            <Col md={6} className="d-none d-sm-block">
              <Row></Row>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
  passwordEditForm = () => {
    return (
      <>
        <div className="form-group">
          <div className="input-group with-focus">
            <input
              type="hidden"
              name="email"
              className={"hidden"}
              value="sdfldskf"
            />
            <div className="input-group-prepend">
              <span className="input-group-text text-muted bg-transparent border-left-0">
                <FaLock />
              </span>
            </div>
            <Input
              type="password"
              name="password"
              //   className="border-right-0"
              placeholder="New Password"
              onChange={this.onChange}
              // invalid={this.hasError('formLogin', 'email', 'required') || this.hasError('formLogin', 'email', 'email')}

              //   placeholder="user@email.com"
              disabled={this.state.loading}
              value={this.state.password}
            />

            {/* {this.hasError("formLogin", "email", "required") && (
                          <span className="invalid-feedback">
                            Field is required
                          </span>
                        )} */}
            {/* {this.hasError("formLogin", "email", "email") && (
                          <span className="invalid-feedback">
                            Field must be valid email
                          </span>
                        )} */}
          </div>
        </div>
        <div className="form-group">
          <div className="input-group with-focus">
            <input
              type="hidden"
              name="password_confirmation"
              className={"hidden"}
              value="sdfldskf"
            />
            <div className="input-group-prepend">
              <span className="input-group-text text-muted bg-transparent border-left-0">
                <FaLock />
              </span>
            </div>
            <Input
              type="password"
              name="password_confirmation"
              //   className="border-right-0"
              placeholder="Confirm Password"
              onChange={this.onChange}
              // invalid={this.hasError('formLogin', 'email', 'required') || this.hasError('formLogin', 'email', 'email')}

              //   placeholder="user@email.com"
              disabled={this.state.loading}
              value={this.state.password_confirmation}
            />
          </div>
        </div>
        <button
          className="btn btn-block btn-secondary mt-3"
          type="submit"
          onClick={this.changePassword}
          disabled={this.state.loading}
        >
          {this.state.loading ? (
            <LoadingWidget color={"#fff"} />
          ) : (
            "Change Password"
          )}
        </button>
      </>
    );
  };
}
