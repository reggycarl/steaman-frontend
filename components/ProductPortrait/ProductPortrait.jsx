import Link from "next/link";
import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import { baseurl } from "../../misc/Axios";
import Image from "next/image";
import NumberField from "../../misc/NumberField";
import styles from "./ProductPortrait.module.scss";
import ReactStars from "react-rating-stars-component";
export default class ProductPortrait extends Component {
  render() {
    var product = this.props.product;
    if (this.props.search_result == true) {
      product = this.props.product._source;
    }
    return (
      <Col
        className={`${styles.container}`}
        lg={25}
        md={this.props.three ? 3 : 2}
        sm={6}
        xs={6}
        key={this.props.key}
      >
        <Link href={`/products/${product.slug}`}>
          <a className="col-md-12">
            <Col className={styles.inner}>
              <Row>
                <Col className={styles.photoDiv} md={12}>
                  {product.on_actual_sale == true ? (
                    <div className={styles.discount_banner}>
                      {Math.ceil(
                        ((product.regular_price - product.sale_price) /
                          product.regular_price) *
                          100
                      )}{" "}
                      %
                    </div>
                  ) : (
                    ""
                  )}
                  {product.featured_photo != null &&
                  product.featured_photo != "" ? (
                    <Image
                      width={200}
                      height={150}
                      layout="intrinsic"
                      src={product.featured_photo}
                    />
                  ) : (
                    ""
                  )}
                </Col>
                <Col md={12}>
                  <h4 className="name">{product.name}</h4>
                </Col>
                <Col md={12}>
                  <h3 className={"price"}>
                    GHS <NumberField value={product.price} />
                  </h3>
                </Col>

                <Col md={12}>
                  <h6 className={"price"}>
                    {product.on_actual_sale == true ? (
                      <strikethrough>
                        <>
                          GHS <NumberField value={product.regular_price} />
                        </>
                        )
                      </strikethrough>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </h6>
                  <h6>
                    {product.on_actual_sale == true ? (
                      <>
                        You Save GHS&nbsp;
                        <NumberField
                          value={product.regular_price - product.sale_price}
                        />
                      </>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </h6>
                </Col>
                <Col md={12}>
                  <Row>
                    <Col md={8}>
                      <h6 className={"price col-md-6"}>
                        <ReactStars
                          count={5}
                          isHalf={true}
                          id="reviewStarsBox"
                          value={product.rating ? product.rating[0] : 0}
                          edit={false}
                          size={12}
                          style={{ display: "inline !important" }}
                          activeColor="#ffd700"
                        />
                        <span>
                          ({product.rating ? product.rating[1] : 0}) reviews
                        </span>
                      </h6>
                    </Col>
                    <Col md={4}>
                      <h6 className={"col-md-6"}>
                        <>
                          {Math.round(product.points || 0)}
                          &nbsp;points
                        </>
                      </h6>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </a>
        </Link>
      </Col>
    );
  }
}
