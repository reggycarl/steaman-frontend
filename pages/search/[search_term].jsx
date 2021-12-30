import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import FullLoadingWidget from "../../components/FullLoadingWidget/FullLoadingWidget";
import ProductPortrait from "../../components/ProductPortrait/ProductPortrait";
import axiosInstance from "../../misc/Axios";
import styles from "../../styles/search.module.scss";
import qs from "query-string";
import Router from "next/router";
import SortWidget from "../../components/SortWidget/SortWidget";
import Head from "next/head";
import Pagination from "react-js-pagination";

export default class search extends Component {
  state = {
    products: [],
    loading: false,
  };
  navigateTo = (page) => {
    var path = Router.router.asPath;
    path = path.split("?")[0];
    console.log("NAVIGATING...", path);
    this.setState({
      ...this.state,
      loading: true,
    });

    Router.push(`${path}?page=${page}&filter=${this.state.filter}`);
  };
  componentDidMount = () => {
    var query_string = qs.parse(location.search);

    console.log("THIS IS QUERY", query_string.page);
    var page = parseInt(query_string.page) || 1;
    var filter = query_string.filter == null ? "rec" : query_string.filter;
    this.setState({
      ...this.state,
      loading: true,
      filter: filter,
    });
    axiosInstance
      .get(
        `/v1/search/?search_term=${this.props.search_term}&page=${page}&filter=${filter}`
      )
      .then((response) => {
        if (response.status == 200) {
          console.log("THIS IS RESULT", response);
          this.setState({
            ...this.state,
            products: response.data.products,
            size: response.data.size,
            per_page: response.data.per_page,
            loading: false,
          });
        } else {
          this.setState({
            ...this.state,
            loading: false,
            products: [],
          });
        }
      });
  };
  componentDidUpdate = (prevProps) => {
    var query_string = qs.parse(location.search);
    var filter = query_string.filter == null ? "rec" : query_string.filter;
    console.log("THIS IS QUERY", query_string.page);
    var page = parseInt(query_string.page) || 1;

    console.log("FETCHING STUFF...");
    if (
      prevProps.search_term != this.props.search_term ||
      page != this.state.page
    ) {
      this.setState({
        ...this.state,
        loading: true,
        page: page,
      });
      axiosInstance
        .get(
          `/v1/search/?search_term=${this.props.search_term}&page=${page}&filter=${filter}`
        )
        .then((response) => {
          if (response.status == 200) {
            console.log("THIS IS RESULT", response);
            this.setState({
              ...this.state,
              products: response.data.products,
              size: response.data.size,
              per_page: response.data.per_page,

              loading: false,
            });
          } else {
            this.setState({
              ...this.state,
              loading: false,
            });
          }
        });
    }
  };
  filterBy = (filter) => {
    this.setState({
      ...this.state,
      filter: filter,
      loading: true,
    });

    var query_string = qs.parse(location.search);

    console.log("THIS IS QUERY", query_string.page);
    var page = parseInt(query_string.page) || 1;

    console.log("FETCHING STUFF...");

    axiosInstance
      .get(
        `/v1/search/?search_term=${this.props.search_term}&page=${page}&filter=${filter}`
      )
      .then((response) => {
        if (response.status == 200) {
          console.log("THIS IS RESULT", response);
          this.setState({
            ...this.state,
            products: response.data.products,

            size: response.data.size,
            per_page: response.data.per_page,

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
          <title>Steaman - Search Results for: {this.props.search_term}</title>
        </Head>
        <Col className={styles.wrapper}>
          <Row>
            <Col className={"topSide"}>
              <Row>
                <Col md={9} className={"topSide"}>
                  <h2>Search Results for: {this.props.search_term}</h2>
                </Col>
                <Col md={3}>
                  <SortWidget
                    filterBy={this.filterBy}
                    filter={this.state.filter}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={`${styles.productInfo} pageContent`}>
            <Col>
              <Row>
                {this.state.loading ? (
                  <FullLoadingWidget loading={this.state.loading} />
                ) : this.state.products.length > 0 ? (
                  this.state.products.map((product, index) => {
                    return <ProductPortrait product={product} key={index} />;
                  })
                ) : (
                  <Col md={12} className="centered">
                    <h4>There are no items matching your search</h4>
                  </Col>
                )}
              </Row>
              <Row>
                <Col>
                  <Pagination
                    activePage={parseInt(this.state.page || 1)}
                    itemsCountPerPage={this.state.per_page || 20}
                    totalItemsCount={this.state.size}
                    pageRangeDisplayed={6}
                    itemClass="btn btn-success"
                    innerClass="btn-group btn-group-toggle special pagination"
                    onChange={this.navigateTo.bind(this)}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

export async function getServerSideProps(context) {
  console.log("THIS IS ID");
  // var term = context.query.term;
  var term = context.params.search_term;

  return {
    props: { search_term: term }, // will be passed to the page component as props
  };
}
