import React, { Component } from "react";
import { Col, Input, Row } from "reactstrap";
import Layout from "../../misc/Layout";
import styles from "./category.module.scss";
import axiosInstance, { baseurl } from "../../misc/Axios";
import ProductPortrait from "../../components/ProductPortrait/ProductPortrait";
import Head from "next/head";
import FullLoadingWidget from "../../components/FullLoadingWidget/FullLoadingWidget";
import qs from "query-string";
import Router, { useRouter } from "next/router";
import SortWidget from "../../components/SortWidget/SortWidget";
import Pagination from "react-js-pagination";
import SideBar from "../../components/SideBar/SideBar";

export default class Categories extends Component {
  state = {
    products: [],
    loading: false,
    brands: "",
    colors: "",
    sizes: "",
  };
  navigateTo = (page) => {
    var path = Router.router.asPath;
    path = path.split("?")[0];
    console.log("NAVIGATING...", path);
    this.setState({
      ...this.state,
      loading: true,
    });
    Router.push(
      `${path}?page=${page}&filter=${this.state.filter}&brands=${this.state.brands}&sizes=${this.state.sizes}&colors=${this.state.colors}`
    );
  };

  componentDidUpdate = (prevProps) => {
    console.log("FETCHING STUFF...");
    console.log("prevProps", prevProps);
    console.log("props", this.props);

    var query_string = qs.parse(location.search);

    console.log("THIS IS QUERY", query_string.page);
    var page = query_string.page || 1;
    var brands = query_string.brands != null ? query_string.brands : "";
    var sizes = query_string.sizes != null ? query_string.sizes : "";
    var colors = query_string.colors != null ? query_string.colors : "";
    console.log("THIS IS PREV", prevProps);
    var query_string = qs.parse(location.search);
    console.log("THIS IS QUERY", query_string.page);
    var filter = query_string.filter || "rec";
    console.log("THIS IS PAGE", page);
    if (this.state.page != page) {
      axiosInstance
        .get(
          `/v1/categories/${this.props.category.uuid}?with_products=true&page=${page}&filter=${filter}&brands=${brands}&sizes=${sizes}&colors=${colors}`
        )
        .then((response) => {
          console.log("THISIS IS RESPONSE", response.data.category.products[0]);
          if (response.status == 200) {
            this.setState({
              ...this.state,
              products: response.data.category.products,
              loading: false,
              page: page,
              per_page: response.data.per_page,
              filter: filter,
              brands: brands,
              colors: colors,
              sizes: sizes,
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
    if (prevProps.category.id != this.props.category.id) {
      this.setState({
        ...this.state,
        loading: true,
        filter: filter,
      });
      axiosInstance
        .get(
          `/v1/categories/${this.props.category.uuid}?with_products=true&filter=${filter}&brands=${brands}&sizes=${sizes}&colors=${colors}`
        )
        .then((response) => {
          if (response.status == 200) {
            this.setState({
              ...this.state,
              products: response.data.category.products,
              loading: false,
              size: response.data.category.size,
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
        `/v1/categories/${this.props.category.uuid}?with_products=true&filter=${filter}&brands=${this.state.brands}&sizes=${this.state.sizes}&colors=${this.state.colors}`
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            ...this.state,
            products: response.data.category.products,
            loading: false,
            size: response.data.category.size,
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

    console.log("THIS IS QUERY", query_string.brands);
    var page = parseInt(query_string.page) || 1;
    var filter = query_string.filter != null ? query_string.filter : "rec";
    var brands = query_string.brands != null ? query_string.brands : "";
    var sizes = query_string.sizes != null ? query_string.sizes : "";
    var colors = query_string.colors != null ? query_string.colors : "";
    console.log("DEBUGGIN", query_string.colors != null);
    console.log("DEBUGGIN", query_string.colors);

    this.setState({
      ...this.state,
      loading: true,
      page: page,
      filter: filter,
    });
    axiosInstance
      .get(
        `/v1/categories/${this.props.category.uuid}?with_products=true&page=${page}&filter=${filter}&brands=${brands}&sizes=${sizes}&colors=${colors}`
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            ...this.state,
            products: response.data.category.products,
            size: response.data.category.size,
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
  sideBarFilter = (brands, colors, sizes) => {
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
        `/v1/categories/${this.props.category.uuid}?with_products=true&page=${page}&filter=${filter}&brands=${brands}&sizes=${sizes}&colors=${colors}`
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            ...this.state,
            products: response.data.category.products,
            size: response.data.category.size,
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
    console.log("THESE ARE ACTIONS", this.props.actions);

    var page = this.state.page || 1;
    var items_to_show = 6;
    var start_page = page;
    var number_of_pages = Math.ceil(
      parseInt(this.state.size) / parseInt(this.state.per_page)
    );
    console.log("THESE ARE NUMBER OF PAGES", this.state.size);
    if (parseInt(number_of_pages) < items_to_show) {
      start_page = 0;
      items_to_show = number_of_pages; // -(page-1)
    } else if (parseInt(page) == parseInt(number_of_pages)) {
      start_page = page - 10;
    } else if (parseInt(number_of_pages) - parseInt(page) < items_to_show) {
      start_page = page - 9;
    } else if (page > items_to_show) {
      //    number_of_times = items_to_show;
      start_page = page - 5;
    } else if (page > items_to_show / 5) {
      //    number_of_times = items_to_show;
      start_page = page - 2;
    } else {
      // var number_of_times = items_to_show

      start_page = 0;
      // start_page = page - 5;
    }

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
          item_list_name:'${this.props.category.name}',
          item_list_id: '${this.props.category.id}'
        });
    `,
            }}
          ></script>
          <title>{this.props.category.name} Category</title>
        </Head>
        <Col className={styles.wrapper}>
          <Row>
            <Col md={12} className={"topSide"}>
              <Row>
                <Col md={9}>
                  <h2>{this.props.category.name}</h2>
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
                          <>
                            <ProductPortrait
                              product={product}
                              key={index}
                              three={true}
                            />
                          </>
                        );
                      })
                    ) : (
                      <Col md={12} className="centered">
                        <h4>This Category has no Products</h4>
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
  var category_id = context.params.pid;
  var response = await fetch(`${baseurl}/v1/categories/${category_id}`);
  var category = await response.json();
  var colors_response = await fetch(
    `${baseurl}/v1/categories/${category_id}/get_colors`
  );
  var colors = await colors_response.json();
  console.log("THESE ARE COLORS", colors);

  var sizes_response = await fetch(
    `${baseurl}/v1/categories/${category_id}/get_sizes`
  );
  var sizes = await sizes_response.json();
  console.log("THESE ARE Sizes", sizes);

  var brands_response = await fetch(
    `${baseurl}/v1/categories/${category_id}/get_brands`
  );
  var brands = await brands_response.json();
  console.log("THESE ARE BRANDS", brands);
  console.log(category);
  return {
    props: {
      ...category,
      colors: [...colors.data],
      sizes: [...sizes.data],
      brands: [...brands.data],
    }, // will be passed to the page component as props
  };
}
