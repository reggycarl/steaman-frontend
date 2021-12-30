import React, { Component } from "react";
import Layout from "../../misc/Layout";
import styles from "./product.module.scss";
import Router, { withRouter } from "next/router";
import axiosInstance, { baseurl, frontendbaseurl } from "../../misc/Axios";
import SanitizeHTML from "../../misc/Sanitize";

import {
  Card,
  CardText,
  CardTitle,
  Col,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import { Button } from "reactstrap";
import NumberField from "../../misc/NumberField";
// import QuantityWidget from "../../components/QuantityWidget";
import ColorWidget from "../../components/ColorWidget";
import SizesWidget from "../../components/SizesWidget";
import UserContext from "../../components/UserContext";
import QuantityWidget from "../../components/QuantityWidget";
import Link from "next/link";
import ProductPortrait from "../../components/ProductPortrait/ProductPortrait";
import Head from "next/head";
import "react-image-gallery/styles/css/image-gallery.css";

import ImageGallery from "react-image-gallery";

import ReactStars from "react-rating-stars-component";
import { style } from "dom-helpers";
class Product extends Component {
  static contextType = UserContext;
  state = {
    product: {
      name: "Test Product",
      price: "40.00",
      code: "2342342",
      brand: "Samsung",
      photos: [],
    },
    similar_products: [],
    sellers_products: [],
    isLoading: false,
    quantity: 1,
    activeTab: 1,
  };

  onSizeSelected = (size) => {
    console.log(size);
    this.setState({
      ...this.state,
      size_id: size.id,
    });
  };
  onColorSelected = (color) => {
    this.setState({
      ...this.state,
      color_id: color.id,
    });
  };
  onChange = (e) => {
    console.log("TRYING TO CHANGE", e.target);
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };

  addToCart = (e) => {
    e.preventDefault();
    this.context.addToCart({
      product_id: this.props.product.id,
      product: this.props.product,
      quantity: this.state.quantity,
      color_id: this.state.color_id,
      size_id: this.state.size_id,
    });
  };
  buyNow = (e) => {
    e.preventDefault();
    var result = this.context.addToCart({
      product_id: this.props.product.id,
      product: this.props.product,
      quantity: this.state.quantity,
      color_id: this.state.color_id,
      size_id: this.state.size_id,
    });
    console.log("THIS IS RESULT", result);
    if (result == true) {
      Router.push("/cart");
    }
  };
  componentDidMount = () => {
    // this.setState({
    //     ...this.state,
    //     isLoading: true,
    // })
    axiosInstance
      .get(`/v1/products/${this.props.product.slug}/more_from_seller`)
      .then((response) => {
        this.setState({
          ...this.state,
          sellers_products: response.data.data,
        });
      });
    axiosInstance
      .get(`/v1/products/${this.props.product.slug}/similar_products`)
      .then((response) => {
        this.setState({
          ...this.state,
          similar_products: response.data.data,
        });
      });
  };
  addQuantity = (e) => {
    // e.preventDefault();
    console.log("ADDING QUANTITY");
    var new_quantity = this.state.quantity + 1;
    this.setState({
      ...this.state,
      quantity: new_quantity,
    });
  };
  reduceQuantity = (e) => {
    var new_quantity = this.state.quantity - 1;
    if (new_quantity <= 0) {
      new_quantity = 1;
    }
    this.setState({
      ...this.state,
      quantity: new_quantity,
    });
  };
  setQuantity = (e, val) => {
    var value = parseInt(val);
    if (value <= 0) {
      value = 1;
    }
    this.setState({
      ...this.state,
      quantity: value,
    });
  };
  toggle = (val) => {
    this.setState({
      ...this.state,
      activeTab: val,
    });
  };

  // data = [{
  //   image: "http://ssds.com.com"
  // }];

  render() {
    var data = this.props.product.photos.map((photo) => {
      return { original: photo.image_url, thumbnail: photo.image_url };
    });

    return (
      <>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-J14YTKJ6N4"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments)}
        gtag("js", new Date());
        gtag("config", "G-J14YTKJ6N4");
        gtag('event', 'view_item', {
          currency: 'GHS',
          items: [{
            item_id: '${this.props.product.sku}',
            item_name: '${this.props.product.name}',
            
            discount: 0.0,
            affiliation: 'Steaman',
            item_brand: '${
              this.props.product.brand
                ? this.props.product.brand.name
                : "Unkwnown"
            }',
            item_category: '${this.props.product.category.name}',
            item_variant: 'black',
            price: '${this.props.product.regular_price}',
            currency: 'GHS',
            quantity: 1
          }],
          value: ${this.props.product.regular_price}
        });
        
    `,
          }}
        ></script>
        <Head>
          <title>Shop {this.props.product.name} | Steaman Ghana</title>
          <meta charset="utf-8" />

          <meta property="og:type" content="product" />
          <meta property="og:site_name" content="Steaman Ghana" />
          <meta
            property="og:title"
            content={`Shop ${this.props.product.name} | Steaman Ghana`}
          />
          <meta
            property="og:description"
            content={this.props.product.description.replace(/<[^>]*>?/gm, "")}
          />
          <meta
            property="og:url"
            content={`${frontendbaseurl}/products/${this.props.product.slug}`}
          />
          {/* 
          WORK ON ADDING IMAGES
          <meta
            property="og:image"
            content="https://gh.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/268631/1.jpg?1777"
          /> */}
          <meta property="og:locale" content="en_GH" />
          <meta
            name="title"
            content={`Shop ${this.props.product.name} | Steaman Ghana | Pay Via Momo, Visa, MasterCard`}
          />
          <meta name="robots" content="index,follow" />
          <meta
            name="description"
            content={this.props.product.description.replace(/<[^>]*>?/gm, "")}
          />
          {/* <link rel="alternate" href="android-app://com.jumia.android/JUMIA/GH/d/GE779EA0GTW7RNAFAMZ?utm_source=google&amp;utm_medium=organic&amp;adjust_tracker=j1hd8h&amp;adjust_campaign=GOOGLE_SEARCH&amp;adjust_adgroup=https%3A%2F%2Fwww.jumia.com.gh%2Fgeneric-116-plus-smart-watch-1.3-black-13686282.html"> */}
          <link
            rel="canonical"
            href={`${frontendbaseurl}/products/${this.props.product.slug}`}
          ></link>
        </Head>
        <Col className={styles.wrapper}>
          <Row>
            <Col md={12} className={styles.topSide}>
              <h2>{this.props.product.category.name}</h2>
            </Col>
          </Row>
          <Row className={styles.productInfo}>
            <Col md={6} className={styles.pictureContainer}>
              {data.length > 0 ? (
                <ImageGallery
                  originalHeight={250}
                  items={data}
                  showFullscreenButton={false}
                  showPlayButton={false}
                />
              ) : (
                ""
              )}
            </Col>
            <Col md={6} className={styles.productDetails}>
              <Col md={12}>
                <h1>{this.props.product.name}</h1>
              </Col>
              <Col md={12}>
                <p>
                  <b>Product Code: </b> {this.props.product.sku}
                </p>
                <p>
                  <b>Brand: </b>{" "}
                  {this.props.product.brand
                    ? this.props.product.brand.name
                    : "N/A"}
                </p>
                <p className={styles.reviewStarsBox}>
                  <ReactStars
                    count={5}
                    isHalf={true}
                    id="reviewStarsBox"
                    value={this.props.product.rating[0]}
                    edit={false}
                    onChange={this.ratingChanged}
                    size={15}
                    style={{ display: "inline !important" }}
                    activeColor="#ffd700"
                  />
                  <span className={styles.reviewCount}>
                    ({this.props.product.rating[1]} Reviews)
                  </span>
                </p>
              </Col>
              <Col md={12}>
                <h2>
                  {" "}
                  GHS <NumberField value={this.props.product.price} />{" "}
                  {this.props.product.on_actual_sale == true ? (
                    <span className={styles.discountInfo}>
                      <strikethrough>
                        GHS{" "}
                        <NumberField value={this.props.product.regular_price} />{" "}
                      </strikethrough>{" "}
                      &nbsp; You Save GHS{" "}
                      <NumberField
                        value={
                          this.props.product.regular_price -
                          this.props.product.sale_price
                        }
                      />
                    </span>
                  ) : (
                    ""
                  )}
                </h2>
              </Col>
              {this.props.product.points > 0 ? (
                <Col>
                  <p>
                    Order this products and earn{" "}
                    <b className={styles.yellow}>
                      {Math.round(this.props.product.points || 0)}
                      &nbsp;points
                    </b>
                  </p>
                </Col>
              ) : null}
              {this.props.product.colors ? (
                <ColorWidget
                  colors={this.props.product.colors}
                  color_id={this.state.color_id}
                  onColorSelected={this.onColorSelected}
                />
              ) : (
                ""
              )}
              {this.props.product.sizes ? (
                <SizesWidget
                  sizes={this.props.product.sizes}
                  size_id={this.state.size_id}
                  onSizeSelected={this.onSizeSelected}
                />
              ) : (
                ""
              )}
              <Col>
                <h6>
                  Avaliability:{" "}
                  {this.props.product.quantity <= 0 ? (
                    <span className={styles.out_of_stock}>Out of Stock </span>
                  ) : this.props.product.quantity > 10 ? (
                    "In stock"
                  ) : (
                    `Only ${this.props.product.quantity} left in stock `
                  )}{" "}
                </h6>
              </Col>
              <QuantityWidget
                quantity={this.state.quantity}
                product={this.props.product}
                addToCart={this.addToCart}
                buyNow={this.buyNow}
                onChange={this.onChange}
                addQuantity={this.addQuantity}
                reduceQuantity={this.reduceQuantity}
                setQuantity={this.setQuantity}
              />
              <Col md={12}></Col>
            </Col>
          </Row>
          <Row className={styles.sellerInformation}>
            <Col>
              <h3>
                Sold By{" "}
                <span className={styles.company_name}>
                  {this.props.product.company.name}{" "}
                </span>
                <Link href={`/stores/${this.props.product.company.slug}`}>
                  <Button size={"sm"}>View Store</Button>
                </Link>
              </h3>
            </Col>
          </Row>
          <Row className={styles.additonalProductInfo}>
            <Col>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={this.state.activeTab == "1" ? "active" : ""}
                    onClick={() => {
                      this.toggle("1");
                    }}
                  >
                    Overview
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={this.state.activeTab == "2" ? "active" : ""}
                    onClick={() => {
                      this.toggle("2");
                    }}
                  >
                    Shipping
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={this.state.activeTab == "3" ? "active" : ""}
                    onClick={() => {
                      this.toggle("3");
                    }}
                  >
                    Warranty
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={this.state.activeTab == "4" ? "active" : ""}
                    onClick={() => {
                      this.toggle("4");
                    }}
                  >
                    Return Policy
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={this.state.activeTab == "5" ? "active" : ""}
                    onClick={() => {
                      this.toggle("5");
                    }}
                  >
                    Reviews
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent
                activeTab={this.state.activeTab}
                className={styles.tab_content}
              >
                <TabPane
                  tabId="1"
                  className={this.state.activeTab == "1" ? "active" : ""}
                >
                  <Row>
                    <Col sm="12">
                      <h4>Description</h4>
                      {SanitizeHTML(this.props.product.description)}
                      <h4>Key Features</h4>
                      {SanitizeHTML(this.props.product.key_features)}
                      <h4>Whats in the Box</h4>
                      {SanitizeHTML(this.props.product.whats_in_the_box)}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane
                  tabId="2"
                  className={this.state.activeTab == "2" ? "active" : ""}
                >
                  Shipping
                </TabPane>
                <TabPane
                  tabId="3"
                  className={this.state.activeTab == "3" ? "active" : ""}
                >
                  {this.props.product.warranty == null ||
                  this.props.product.warranty == ""
                    ? "This product has no warranty information"
                    : this.props.product.warranty}
                </TabPane>
                <TabPane
                  tabId="4"
                  className={this.state.activeTab == "4" ? "active" : ""}
                >
                  Return Policy
                </TabPane>
                <TabPane
                  tabId="5"
                  className={this.state.activeTab == "5" ? "active" : ""}
                >
                  This product does not have any reviews yet. Be the first to
                  review it.
                </TabPane>
              </TabContent>
            </Col>
          </Row>
          <Row className={styles.sellerInformation}>
            <Col>
              <h3>Similar Items You May Like</h3>
              <Row className={styles.productsList}>
                {this.state.similar_products.map((product, index) => {
                  return <ProductPortrait product={product} key={index} />;
                })}
              </Row>
            </Col>
          </Row>
          <Row className={styles.sellerInformation}>
            <Col>
              <h3>More from this seller</h3>
              <Row className={styles.productsList}>
                {this.state.sellers_products.map((product, index) => {
                  return <ProductPortrait product={product} key={index} />;
                })}
              </Row>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
  renderContent = (content) => content && <b>{content}</b>;
}

export default withRouter(Product);

// export async function getStaticPaths() {
//   return {
//     paths: [{ params: { pid: "*" } }],
//     fallback: true,
//   };
// }
export async function getServerSideProps(context) {
  console.log("THIS IS ID");
  var product_id = context.params.pid;
  try {
    var response = await fetch(
      `${baseurl}/v1/products/${product_id}?full_product_info=true`
    );
    if (response.status == 200) {
      console.log("THIS IS RESPONSE", response);
      var product = await response.json();
      console.log(product);

      return {
        props: { product: product.data }, // will be passed to the page component as props
      };
    } else {
      console.log("THIS IS OTHER RESPONSE", response);

      context.res.writeHead(response.status);
      return { props: {} };
    }
  } catch (err) {
    console.log("THIS IS ERRO", err);
    if (context.res) {
      context.res.writeHead(err.status);
    }
    context.res.writeHead(error.status);
    return { props: {} };
  }
}
