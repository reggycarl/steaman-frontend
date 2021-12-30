import Head from "next/head";
import Link from "next/link";
import React, { Component } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios_original from "axios";
import { Col, Form, Row, Input, Button } from "reactstrap";
import styles from "../styles/auth.module.scss";
import { baseurl } from "../misc/Axios";
import { toast } from "react-toastify";
import LoadingWidget from "../components/LoadingWidget";
export default class ResetPassword extends Component {
  state = {
    loading: false,
    password_changed: false,
    message: "NO ERR",
  };
  resetPassword = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      resetting: true,
    });
    axios_original
      .post(baseurl + "/accounts/password", {
        email: this.state.email,
        redirect_url: "/",
      })
      .then((response) => {
        if (response.status == 200) {
          toast.success(response.data.message);
          this.setState({
            ...this.state,
            email: "",
            message: response.data.message,
            // resetting: false,
            password_changed: true,
          });
        }
      })
      .catch((error) => {
        toast.error("Password Reset Failed");
        this.setState({
          ...this.state,
          resetting: false,
          errors: error.response.data.errors,
        });
      });
  };
  onChange = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };
  render() {
    return (
      <>
        <Head>
          <title>Reset Password </title>
        </Head>
        <Col md={12}>
          <Row className={styles.wrapper}>
            <Col md={12} className=" loginBox">
              <Row className="justify-content-md-center align-items-center h-100">
                <Col md={4} className="loginContainer">
                  <Form>
                    <h3>Reset Password</h3>
                    {this.state.password_changed ? (
                      <h4 className="centered">{this.state.message}</h4>
                    ) : (
                      this.resetPasswordForm()
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
          </Row>
        </Col>
      </>
    );
  }

  resetPasswordForm = () => {
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
                <FaEnvelope />
              </span>
            </div>
            <Input
              type="text"
              name="email"
              //   className="border-right-0"
              placeholder="Enter Email"
              onChange={this.onChange}
              // invalid={this.hasError('formLogin', 'email', 'required') || this.hasError('formLogin', 'email', 'email')}

              //   placeholder="user@email.com"
              disabled={this.state.resetting}
              value={this.state.email}
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

        <button
          className="btn btn-block btn-secondary mt-3"
          type="submit"
          onClick={this.resetPassword}
          disabled={this.state.resetting}
        >
          {this.state.resetting ? (
            <LoadingWidget color={"#fff"} />
          ) : (
            "Reset Password"
          )}{" "}
        </button>
      </>
    );
  };
}
