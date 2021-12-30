import Head from "next/head";
import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import axiosInstance, { baseurl } from "../../misc/Axios";
import styles from "./category_group.module.scss";
import qs from "query-string";
import FullLoadingWidget from "../../components/FullLoadingWidget/FullLoadingWidget";
import ProductPortrait from "../../components/ProductPortrait/ProductPortrait";
import Router from "next/router";
import SortWidget from "../../components/SortWidget/SortWidget";
import Pagination from "react-js-pagination";
import SideBar from "../../components/SideBar/SideBar";
export default class CategoryGroup extends Component {
  state = {
    products: [],
  };

  navigateTo = (page) => {
    var path = Router.router.asPath;
    path = path.split("?")[0];
    this.setState({
      ...this.state,
      loading: true,
    });
    Router.push(
      `${path}?page=${page}&filter=${this.state.filter || "rec"}&brands=${
        this.state.brands
      }&sizes=${this.state.sizes}&colors=${this.state.colors}`
    );
  };
  componentDidUpdate = (prevProps) => {
    var query_string = qs.parse(location.search);

    var page = query_string.page || 1;
    var filter = query_string.filter || "rec";
    var brands = query_string.brands != null ? query_string.brands : "";
    var sizes = query_string.sizes != null ? query_string.sizes : "";
    var colors = query_string.colors != null ? query_string.colors : "";

    var query_string = qs.parse(location.search);

    var page = parseInt(query_string.page) || 1;

    if (this.state.page != page) {
      axiosInstance
        .get(
          `/v1/category_groups/${this.props.category_group.uuid}?with_products=true&page=${page}&filter=${filter}&brands=${brands}&sizes=${sizes}&colors=${colors}`
        )
        .then((response) => {
          if (response.status == 200) {
            this.setState({
              ...this.state,
              products: response.data.category_group.products,
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
    if (prevProps.category_group.id != this.props.category_group.id) {
      this.setState({
        ...this.state,
        loading: true,
      });
      axiosInstance
        .get(
          `/v1/category_groups/${this.props.category_group.uuid}?with_products=true&filter=${filter}&brands=${brands}&sizes=${sizes}&colors=${colors}`
        )
        .then((response) => {
          if (response.status == 200) {
            this.setState({
              ...this.state,
              products: response.data.category_group.products,
              loading: false,
              size: response.data.category_group.size,
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
        `/v1/category_groups/${this.props.category_group.uuid}?with_products=true&filter=${filter}&brands=${this.state.brands}&sizes=${this.state.sizes}&colors=${this.state.colors}`
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            ...this.state,
            products: response.data.category_group.products,
            loading: false,
            size: response.data.category_group.size,
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
  };

  componentDidMount = () => {
    var query_string = qs.parse(location.search);
    var brands = query_string.brands != null ? query_string.brands : "";
    var sizes = query_string.sizes != null ? query_string.sizes : "";
    var colors = query_string.colors != null ? query_string.colors : "";
    var page = parseInt(query_string.page) || 1;
    var filter = query_string.filter || "rec";
    this.setState({
      ...this.state,
      loading: true,
      page: page,
      filter: filter,
    });
    axiosInstance
      .get(
        `/v1/category_groups/${this.props.category_group.uuid}?with_products=true&page=${page}&filter=${filter}&brands=${brands}&sizes=${sizes}&colors=${colors}`
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            ...this.state,
            products: response.data.category_group.products,
            size: response.data.category_group.size,
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
    var query_string = qs.parse(location.search);

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
        `/v1/category_groups/${this.props.category_group.uuid}?with_products=true&page=${page}&filter=${filter}&brands=${brands}&sizes=${sizes}&colors=${colors}`
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            ...this.state,
            products: response.data.category_group.products,
            size: response.data.category_group.size,
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
          item_list_name:'${this.props.category_group.name}',
          item_list_id: '${this.props.category_group.id}'
        });
    `,
            }}
          ></script>
          <title>{this.props.category_group.name} Category</title>
        </Head>
        <Col className={styles.wrapper}>
          <Row>
            <Col className={"topSide"}>
              <Row>
                <Col md={9} className={"topSide"}>
                  <h2>{this.props.category_group.name}</h2>
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
  var id = context.params.cat_id;
  var response = await fetch(`${baseurl}/v1/category_groups/${id}`);
  var category_group = await response.json();

  var colors_response = await fetch(
    `${baseurl}/v1/category_groups/${id}/get_colors`
  );
  var colors = await colors_response.json();

  var sizes_response = await fetch(
    `${baseurl}/v1/category_groups/${id}/get_sizes`
  );
  var sizes = await sizes_response.json();

  var brands_response = await fetch(
    `${baseurl}/v1/category_groups/${id}/get_brands`
  );
  var brands = await brands_response.json();
  return {
    props: {
      ...category_group,
      colors: [...colors.data],
      sizes: [...sizes.data],
      brands: [...brands.data],
    }, // will be passed to the page component as props
  };
}
