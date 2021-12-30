import { repeat } from "lodash";
import Head from "next/head";
import React, { Component } from "react";
import UserContext from "../../components/UserContext";
import { Col, FormGroup, Label, Ro, Input, Row, Button } from "reactstrap";
import FullLoadingWidget from "../../components/FullLoadingWidget/FullLoadingWidget";
import axiosInstance, { baseurl } from "../../misc/Axios";
import styles from "../../styles/product_reviews.module.scss";
import ReactStars from "react-rating-stars-component";
import Link from "next/link";

export default class CartReview extends Component {
  static contextType = UserContext;
  state = {
    loading: false,
    cart: {
      product: {},
    },
    review: {},
    submittingReview: false,
  };
  onChange = (e) => {
    this.setState({
      ...this.state,
      review: {
        ...this.state.review,
        [e.target.name]: e.target.value,
      },
    });
  };
  ratingChanged = (e) => {
    console.log("THIS IS RATING VALUE", e);
    axiosInstance.post(`/v1/users/product_reviews/${this.props.cart_id}/rate`, {
      rating: e,
    });
  };
  submitReview = () => {
    this.setState({
      ...this.state,
      submittingReview: true,
    });
    axiosInstance
      .post(`/v1/users/product_reviews/${this.props.cart_id}/review`, {
        review: { ...this.state.review },
      })
      .then((response) => {
        console.log("THIS IS RESPONSE FROM POST", response);
        if (response.status != 200) {
          this.setState({
            ...this.state,
            submittingReview: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          submittingReview: false,
        });
      });
  };
  componentDidMount = () => {
    console.log("THIS IS CONTEXT", this.context);
    var name = _.isEmpty(this.context.user) ? "" : this.context.user.first_name;
    this.setState({
      ...this.state,
      loading: true,
      review: {
        ...this.state.review,
        name: name,
      },
    });
    axiosInstance
      .get(
        `/v1/users/product_reviews/${this.props.cart_id}?full_product_info=true`
      )
      .then((response) => {
        console.log("THIS IS REPSONSE ", response);
        if (response.status == 200) {
          this.setState({
            ...this.state,
            cart: response.data.cart,
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
  render() {
    return (
      <>
        <Head>
          <title>Reviews & Ratings</title>
        </Head>
        <Col className="topSide" md={12}>
          <h1>Reviews & Ratings</h1>
        </Col>
        {this.state.loading ? (
          <FullLoadingWidget loading={this.state.loading} />
        ) : (
          <Col className={`pageContent ${styles.detailedWrapper}`} md={12}>
            <div className={styles.detailedPhotoBox}>
              {this.state.cart.product.featured_photo != "" ||
              this.state.cart.product.featured_photo != null ? (
                <img src={this.state.cart.product.featured_photo} />
              ) : (
                ""
              )}
            </div>
            <Col className={styles.detailedProductInfo}>
              <p>SKU: {this.state.cart.product.sku}</p>
              <h2>{this.state.cart.product.name}</h2>
              <ReactStars
                count={5}
                isHalf={true}
                onChange={this.ratingChanged}
                size={24}
                activeColor="#ffd700"
              />
              <div>
                <p>&nbsp;</p>
                <h5>Review this product</h5>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Title</Label>
                      <Input
                        className="form-control"
                        name="title"
                        onChange={this.onChange}
                        value={this.state.review.title}
                        readOnly={this.state.submittingReview}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Name</Label>
                      <Input
                        name="name"
                        className="form-control"
                        onChange={this.onChange}
                        value={this.state.review.name}
                        readOnly={this.state.submittingReview}
                      ></Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label>Review</Label>
                      <Input
                        type="textarea"
                        name="notes"
                        onChange={this.onChange}
                        value={this.state.review.notes}
                        className="form-control"
                        readOnly={this.state.submittingReview}
                        rows={6}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Link href="/product_reviews">
                  <Button color="secondary " outline={true}>
                    &lt;&lt; Pending Reviews
                  </Button>
                </Link>
                &nbsp;
                <Button
                  color="success"
                  onClick={this.submitReview}
                  disabled={this.state.submittingReview}
                >
                  Submit Review
                </Button>
              </div>
            </Col>
          </Col>
        )}
      </>
    );
  }
}
export async function getServerSideProps(context) {
  var cart_id = context.params.cart_id;
  console.log("THIS IS CART ID", cart_id);
  return {
    props: { cart_id: cart_id }, // will be passed to the page component as props
  };
}
