import Head from "next/head";
import Link from "next/link";

import React from "react";
import Layout from "../misc/Layout";
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts";
import axiosInstance, { baseurl } from "../misc/Axios";
import { Col, Container, Row } from "reactstrap";
import MainPageSlider from "../components/MainPageSlider/MainPageSlider";
import UserContext from "../components/UserContext";
import BannerWidgetBox from "../components/BannerWidgetBox";

import {
  FaArrowRight,
  FaBullseye,
  FaChevronCircleRight,
  FaListUl,
  FaUserCircle,
} from "react-icons/fa";
import CategoryWidget from "../components/CategoryWidget/CategoryWidget";
import styles from "../styles/Home.module.scss";
export default class Home extends React.Component {
  static contextType = UserContext;
  state = {
    categories: [],
    category_widgets: [],
    showSubMenus: false,
  };
  componentDidMount = () => {
    // axiosInstance.get("/v1/category_widgets?type=roots").then((response) => {
    //   this.setState({
    //     category_widgets: response.data.data,
    //   });
    // });
  };

  timer = () =>
    setTimeout(
      () =>
        this.setState({
          ...this.state,
          showSubMenus: false,
        }),
      2000
    );

  timer_id = this.timer();

  render() {
    var widget_1 = this.props.info_widgets.find((widget) => {
      return widget.position == 1;
    });
    var widget_2 = this.props.info_widgets.find((widget) => {
      return widget.position == 2;
    });
    var widget_3 = this.props.info_widgets.find((widget) => {
      return widget.position == 3;
    });
    var widget_4 = this.props.info_widgets.find((widget) => {
      return widget.position == 4;
    });
    var widget_5 = this.props.info_widgets.find((widget) => {
      return widget.position == 5;
    });
    return (
      <>
        <Head>
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
    `,
            }}
          ></script>
        </Head>

        <Col md={12} className={styles.wrapper}>
          <Row>
            <Head>
              <title>Steaman</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Col id="banner" className={`${styles.banner}`}>
              <Row
                className={` d-flex justify-content-center align-items-stretch`}
              >
                <Col
                  md={2}
                  onMouseEnter={this.showSubMenus}
                  onMouseLeave={this.hideSubMenus}
                  className={`sideBar sideBarLeft .hidden-sm-down d-none d-md-block`}
                >
                  <Col
                    className={
                      "h-100 d-flex flex-column justify-content-center"
                    }
                  >
                    <BannerWidgetBox widget={widget_1} />
                    <BannerWidgetBox widget={widget_2} />
                  </Col>
                </Col>
                <Col md={8}>
                  <Row className={"h-100"}>
                    <MainPageSlider />
                  </Row>
                </Col>
                <Col
                  md={2}
                  onMouseEnter={this.showSubMenus}
                  onMouseLeave={this.hideSubMenus}
                  className={`sideBar sideBarLeft .hidden-sm-down d-none d-md-block`}
                >
                  <Col
                    className={
                      "h-100 d-flex flex-column justify-content-center"
                    }
                  >
                    <BannerWidgetBox widget={widget_3} />
                    <BannerWidgetBox widget={widget_4} />
                  </Col>
                </Col>

                {/* <Col
                  md={2}
                  className="sideBar sideBarRight .hidden-sm-down d-none d-md-block"
                >
                  <Row className="h-100">
                    <Col md={12} className={"h-100 "}>
                      <Col className="h-50">
                        <Row className="h-100 align-items-center">
                          <Col md={12} className="inner h-100">
                            <Row className="h-100 align-items-center">
                              {widget_3 ? (
                                <Link href={widget_3.link}>
                                  <a>
                                    <img src={widget_3.photo.image_url} />{" "}
                                  </a>
                                </Link>
                              ) : (
                                ""
                              )}
                            </Row>
                          </Col>
                        </Row>
                      </Col>

                      <Col className=" h-50">
                        <Row className="h-100">
                          <Col md={12} className="inner h-100">
                            <Row className="h-100 align-items-center">
                              {widget_4 ? (
                                <Link href={widget_4.link}>
                                  <a>
                                    <img src={widget_4.photo.image_url} />{" "}
                                  </a>
                                </Link>
                              ) : (
                                ""
                              )}
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Col>
                  </Row>
                </Col> */}
              </Row>
            </Col>

            <FeaturedProducts products={this.props.featured_products} />

            {this.props.category_widgets.map((widget) => {
              return (
                <CategoryWidget
                  category_id={widget.category_id}
                  widget_id={widget.uuid}
                  widget={widget}
                />
              );
            })}
          </Row>
        </Col>
      </>
    );
  }
}

export async function getServerSideProps(context) {
  // var page_id = context.params.page_id;
  var info_widgets_response = await fetch(`${baseurl}/v1/info_widgets/`);
  var category_widgets_response = await fetch(
    `${baseurl}/v1/category_widgets/`
  );
  var featured_products_response = await fetch(
    `${baseurl}/v1/products?type=featured`
  );

  var info_widgets = await info_widgets_response.json();
  var category_widgets = await category_widgets_response.json();
  var featured_products = await featured_products_response.json();
  // console.log("THIS IS DATA", featured_products.data[0]);
  return {
    props: {
      info_widgets: [...info_widgets.data],
      category_widgets: [...category_widgets.data],
      featured_products: [...featured_products.data],
    }, // will be passed to the page component as props
  };
}
