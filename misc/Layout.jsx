import React, { Component } from "react";
import Login from "../pages/login";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Col, Row } from "reactstrap";
import styles from "./layout.module.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

import TopBanner from "../components/TopBanner";
import UserContext from "../components/UserContext";
import { Freshchat } from "reactjs-freshchat";
import "reactjs-freshchat/dist/index.css";

// Take in a component as argument WrappedComponent
class Layout extends Component {
  static contextType = UserContext;

  render() {
    return (
      <>
        {this.context.loggedIn() ? (
          <Freshchat
            token={process.env.NEXT_PUBLIC_FRESHCHAT_TOKEN}
            externalId={this.context.user.email}
            firstName={this.context.user.first_name}
            lastName={this.context.user.last_name}
          />
        ) : (
          <Freshchat token={process.env.NEXT_PUBLIC_FRESHCHAT_TOKEN} />
        )}
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, 
     user-scalable=0"
          />

          <meta name="apple-mobile-web-app-capable" content="yes" />
          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/apple-icon-57x57.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/apple-icon-60x60.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/apple-icon-72x72.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/apple-icon-76x76.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/apple-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/apple-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/apple-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/apple-icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/android-icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/favicon-96x96.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <TopBanner />
        <Navbar
          categories={this.props.categories}
          categories_tree={this.props.categories_tree}
          category_groups={this.props.category_groups}
        />
        <ToastContainer />
        <Col md={12} className={styles.wrapper}>
          <Row className="h-100">{this.props.children}</Row>
        </Col>

        <Footer />
        <script
          type="text/javascript"
          src="https://prod.theteller.net/checkout/resource/api/inline/theteller_inline.js"
        ></script>
      </>
    );
  }
}

export default Layout;

export async function getServerSideProps(context) {
  // var page_id = context.params.page_id;
  console.log("RUNNING BEFORE APP>>>>");
  // var info_widgets_response = await fetch(
  //   `${baseurl}/v1/info_widgets/`
  // );
  // var category_widgets_response = await fetch(
  //   `${baseurl}/v1/category_widgets/`
  // );
  // var info_widgets = await info_widgets_response.json();
  // var category_widgets = await category_widgets_response.json();

  // return {
  //   this.props: { info_widgets: [...info_widgets.data], category_widgets: [...category_widgets.data] }, // will be passed to the page component as this.props
  // };
}
