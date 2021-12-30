import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import ProductPortrait from "../../components/ProductPortrait/ProductPortrait";
import axiosInstance, { baseurl } from "../../misc/Axios";
import styles from "./store.module.scss";
import qs from "query-string";
import Router from "next/router";
import FullLoadingWidget from "../../components/FullLoadingWidget/FullLoadingWidget";
import Pagination from "react-js-pagination";
import SortWidget from "../../components/SortWidget/SortWidget";
import SideBar from "../../components/SideBar/SideBar";
import Head from "next/head";
export default class Store extends Component {
  state = {
    products: [],
  };

  componentDidUpdate = (prevProps) => {
    console.log("FETCHING STUFF...");
    console.log("prevProps", prevProps);
    console.log("props", this.props);
    var query_string = qs.parse(location.search);
    console.log("THIS IS QUERY", query_string.page);
    var page = query_string.page || 1;
    console.log("THIS IS PREV", prevProps);
    var query_string = qs.parse(location.search);

    console.log("THIS IS QUERY", query_string.page);
    var page = parseInt(query_string.page) || 1;
    var filter = query_string.filter || "rec";
    console.log("THIS IS PAGE", page);
    if (this.state.page != page) {
      axiosInstance
        .get(
          `/v1/stores/${this.props.store.slug}?with_products=true&page=${page}&filter=${filter}`
        )
        .then((response) => {
          console.log("THISIS IS RESPONSE", response.data.store.products[0]);
          if (response.status == 200) {
            this.setState({
              ...this.state,
              products: response.data.store.products,
              loading: false,
              page: page,
              per_page: response.data.per_page,
              filter: filter,
            });
          } else {
            this.setState({
              ...this.state,
              loading: false,
              filter: filter,
            });
          }
        });
    }
    if (prevProps.store.id != this.props.store.id) {
      this.setState({
        ...this.state,
        loading: true,
        filter: filter,
      });
      axiosInstance
        .get(
          `/v1/stores/${this.props.store.slug}?with_products=true&filter=${filter}`
        )
        .then((response) => {
          if (response.status == 200) {
            this.setState({
              ...this.state,
              products: response.data.store.products,
              loading: false,
              size: response.data.store.size,
              per_page: response.data.per_page,
              filter: filter,
            });
          } else {
            this.setState({
              ...this.state,
              loading: false,
              filter: filter,
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

    axiosInstance
      .get(
        `/v1/stores/${this.props.store.slug}?with_products=true&filter=${filter}`
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            ...this.state,
            products: response.data.store.products,
            loading: false,
            size: response.data.store.size,
            per_page: response.data.per_page,
          });
        } else {
          this.setState({
            ...this.state,
            loading: false,
          });
        }
      });
  };
  componentDidMount = () => {
    var query_string = qs.parse(location.search);
    console.log("THIS IS QUERY", query_string.page);
    var brands = query_string.brands != null ? query_string.brands : "";
    var sizes = query_string.sizes != null ? query_string.sizes : "";
    var colors = query_string.colors != null ? query_string.colors : "";
    var page = parseInt(query_string.page) || 1;
    var filter = query_string.filter || "rec";
    this.setState({
      ...this.state,
      loading: true,
      page: page,
    });

    axiosInstance
      .get(
        `/v1/stores/${this.props.store.slug}?with_products=true&page=${page}&filter=${filter}&brands=${brands}&sizes=${sizes}&colors=${colors}`
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            ...this.state,
            products: response.data.store.products,
            size: response.data.store.size,
            per_page: response.data.per_page,
            loading: false,
            brands: brands,
            sizes: sizes,
            colors: colors,
          });
        } else {
          this.setState({
            ...this.state,
            loading: false,
          });
        }
      });
  };
  sideBarFilter = (brands, colors, sizes) => {
    console.log("THIS IS BRAND", brands);
    var query_string = qs.parse(location.search);
    console.log("THIS IS QUERY", query_string.page);
    var page = parseInt(query_string.page) || 1;
    var filter = query_string.filter || this.state.filter || "rec";
    this.setState({
      ...this.state,
      loading: true,
      page: page,
      filter: filter,
      // brands: brands,
      // colors: colors,
      // sizes: sizes,
    });
    axiosInstance
      .get(
        `/v1/stores/${this.props.store.slug}?with_products=true&page=${page}&filter=${filter}&brands=${brands}&sizes=${sizes}&colors=${colors}`
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            ...this.state,
            products: response.data.store.products,
            size: response.data.store.size,
            per_page: response.data.per_page,
            loading: false,
            brands: brands,
            colors: colors,
            sizes: sizes,
          });
        } else {
          this.setState({
            ...this.state,
            loading: false,
          });
        }
      });
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

  render() {
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
  gtag('event', 'view_item_list', {
    items: [],
    item_list_name:'${this.props.store.name}',
    item_list_id: '${this.props.store.id}'
  });
`,
            }}
          ></script>
          <title>{this.props.store.name} Store</title>
        </Head>

        <Col className={styles.wrapper}>
          <Row>
            <Col md={12} className={"topSide"}>
              <Row>
                <Col md={9}>
                  <h2>{this.props.store.name}</h2>
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
          <div className={styles.contentWrapper}>
            <SideBar
              sizes={this.props.sizes}
              brands={this.props.brands}
              colors={this.props.colors}
              sideBarFilter={this.sideBarFilter}
            />
            <div className={styles.mainContent}>
              <Row className={`${styles.productInfo} pageContent`}>
                <Col md={12}>
                  <Row>
                    {this.state.loading ? (
                      <FullLoadingWidget loading={this.state.loading} />
                    ) : this.state.products.length > 0 ? (
                      this.state.products.map((product, index) => {
                        return (
                          <ProductPortrait
                            product={product}
                            key={index}
                            three={true}
                          />
                        );
                      })
                    ) : (
                      <Col md={12} className="centered">
                        <h4>This Store has no Products</h4>
                      </Col>
                    )}
                  </Row>
                </Col>
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
            </div>
          </div>
        </Col>
      </>
    );
  }
}

export async function getServerSideProps(context) {
  console.log("THIS IS ID");
  var store_id = context.params.pid;
  var response = await fetch(`${baseurl}/v1/stores/${store_id}`);
  var store = await response.json();

  var colors_response = await fetch(
    `${baseurl}/v1/stores/${store_id}/get_colors`
  );
  var colors = await colors_response.json();
  console.log("THESE ARE COLORS", colors);

  var sizes_response = await fetch(
    `${baseurl}/v1/stores/${store_id}/get_sizes`
  );
  var sizes = await sizes_response.json();
  console.log("THESE ARE Sizes", sizes);

  var brands_response = await fetch(
    `${baseurl}/v1/stores/${store_id}/get_brands`
  );
  var brands = await brands_response.json();
  console.log("THESE ARE BRANDS", brands);
  console.log(store);
  return {
    props: {
      ...store,
      colors: [...colors.data],
      sizes: [...sizes.data],
      brands: [...brands.data],
    }, // will be passed to the page component as props
  };
}
