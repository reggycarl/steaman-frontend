import Head from "next/head";
import React, { Component } from "react";
import { Button, Col, Table } from "reactstrap";
import FullLoadingWidget from "../../components/FullLoadingWidget/FullLoadingWidget";
import ReviewItem from "../../components/ReviewItem/ReviewItem";
import axiosInstance from "../../misc/Axios";
import _ from "lodash";

// import styles from '../styles/product_reviews.module.scss';
import styles from "../../styles/product_reviews.module.scss";
import { Fa500Px, FaBorderNone, FaList } from "react-icons/fa";
import Link from "next/link";
export default class ProductReviews extends Component {
  state = {
    loading: false,
    carts: [],
  };
  componentDidMount = () => {
    this.setState({
      ...this.state,
      loading: true,
    });
    axiosInstance.get("v1/users/product_reviews").then((response) => {
      console.log(response);
      if (response.status == 200) {
        this.setState({
          ...this.state,
          carts: response.data.data,
          loading: false,
        });
      }
    });
  };
  render() {
    return (
      <>
        <Head>
          <title>Pending Reviews & Ratings</title>
        </Head>
        <Col className="topSide" md={12}>
          <h1>Reviews & Ratings</h1>
        </Col>
        {this.state.loading ? (
          <FullLoadingWidget loading={this.state.loading} />
        ) : (
          <Col className={`pageContent ${styles.wrapper}`} md={12}>
            {_.isEmpty(this.state.carts) ? (
              this.nothingToReview()
            ) : (
              <Table borderless="true">
                <thead>
                  <tr>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.carts.map((cart) => {
                    return (
                      <tr>
                        <td>
                          <ReviewItem cart={cart} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Col>
        )}
      </>
    );
  }

  nothingToReview = () => {
    return (
      <div className="centered noData">
        <FaList size={30} />
        <h2>You currenty don't have any orders to review</h2>;
        <Link href="/">
          <a>
            <Button color="success">Continue Shopping</Button>
          </a>
        </Link>
      </div>
    );
  };
}
