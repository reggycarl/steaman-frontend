import Link from "next/link";
import Router from "next/router";
import React, { Component } from "react";
import { FaSearch } from "react-icons/fa";
import { Col, Button, Form } from "reactstrap";
import axiosInstance from "../../misc/Axios";
import styles from "./search_widget.module.scss";
export default class SearchWidget extends Component {
  state = { search_term: "", showSearchResults: false, result_data: [] };
  onChange = (e) => {
    var val = e.target.value;
    var showSearchResults = false;
    if (val.length >= 2) {
      showSearchResults = true;

      axiosInstance
        .get(`/v1/search/search?search_term=${val}`)
        .then((response) => {
          console.log("THIS IS RESPONSE response", response.data);
          this.setState({
            ...this.state,
            showSearchResults: showSearchResults,
            result_data: response.data,
          });
        });
    } else {
      showSearchResults = false;
    }

    this.setState({
      ...this.state,
      [e.target.name]: val,
      showSearchResults: showSearchResults,
    });
  };
  componentDidUpdate = (prevProps) => {
    console.log("TEsting");

    // this.showSearchResults = false;
  };
  showSearchResults = () => {
    if (this.state.search_term.length >= 2) {
      this.setState({
        ...this.state,
        showSearchResults: true,
      });
    } else {
      this.setState({
        ...this.state,
        showSearchResults: false,
      });
    }
  };
  hideSearchResults = () => {
    this.setState({
      ...this.state,
      showSearchResults: false,
    });
  };
  compnoent;
  search = (e) => {
    e.preventDefault();
    if (this.state.search_term.length >= 2) {
      Router.push(`/search/${this.state.search_term}`, undefined, {
        shallow: false,
      });
      this.setState({
        ...this.state,
        showSearchResults: false,
      });
    }
  };
  navigateToProduct = (product) => {
    // this.setState({
    //   ...this.state,
    //   showSearchResults: false,
    // });
    Router.push(`/products/${product.slug}`);
  };
  render() {
    return (
      <Col
        className={`${styles.wrapper} ${
          this.props.mobile ? "d-block d-sm-none" : "d-none d-sm-block"
        }`}
      >
        <Form onSubmit={this.search} autoComplete="off">
          <div
            className={`search-bar input-group py-1 px-2 px-md-0 ${styles.search_bar}`}
          >
            <input
              name={"search_term"}
              className="form-control form-control-dark"
              type="text"
              autoComplete="off"
              onChange={this.onChange}
              onFocus={this.showSearchResults}
              // onBlur={this.hideSearchResults}
              placeholder="Search for products..."
              aria-label="Search"
            />
            <div className="input-group-append">
              <Button
                className="btn btn-success"
                type="submit"
                onClick={this.search}
              >
                <FaSearch />
              </Button>
            </div>
          </div>
        </Form>
        <div>
          {this.state.showSearchResults == true && false ? (
            <Col className={styles.searchResult}>
              {this.state.result_data.length > 0 ? (
                <ul>
                  {this.state.result_data.map((result, index) => {
                    var product = result._source;
                    return (
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={this.hideSearchResults}
                      >
                        <a>
                          <li>{product.name}</li>
                        </a>
                      </Link>
                    );
                  })}
                </ul>
              ) : (
                <p className="centered">
                  &nbsp; <br /> <b>No Results Found</b>
                </p>
              )}
            </Col>
          ) : (
            ""
          )}
        </div>
      </Col>
    );
  }
}
