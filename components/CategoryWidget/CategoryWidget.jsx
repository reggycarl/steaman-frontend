import Link from "next/link";
import React, { Component } from "react";
import { Col, Container, Row, Button } from "reactstrap";
import axiosIntance from "../../misc/Axios";
import ProductPortrait from "../ProductPortrait/ProductPortrait";
import styles from "./CategoryWidget.module.scss";
export default class CategoryWidget extends Component {
  state = {
    widget: { category: { name: "Loading" }, featured_products: [] },
    featured_products: [],
  };
  componentDidMount = () => {
    console.log("THIS IS CAT", this.props.widget.category);
    console.log("Category Widget Products Mounted Man!!!");
    // axiosIntance.get(`/v1/category_widgets/${this.props.widget_id}`).then(response => {
    //     console.log("THIS IS DATA", response.data.widget)
    //     this.setState({
    //         ...this.state,
    //         widget: response.data.data
    //     })
    // })
  };
  render() {
    return (
      <Col md={12}>
        <Col md={12} className={styles.wrapper}>
          <Row>
            <Col md={12} className={styles.title}>
              <h3>
                <Link href={`/categories/${this.props.widget.category.uuid}`}>
                  <a>{this.props.widget.category.name}</a>
                </Link>
                <Link href={`/categories/${this.props.widget.category.uuid}`}>
                  <a>
                    {" "}
                    <Button
                      size={"sm"}
                      outline="primary"
                      className="float-right"
                    >
                      View Category
                    </Button>
                  </a>
                </Link>
              </h3>
            </Col>
            {this.props.widget.featured_products.map((product, index) => {
              return <ProductPortrait product={product} key={index} />;
            })}
          </Row>
        </Col>
      </Col>
    );
  }
}

// export async function getServerSideProps(context) {
//   console.log("MOUNTING CATEGORY WIDGET");
//   // // var page_id = context.params.page_id;
//   // var info_widgets_response = await fetch(
//   //   `${baseurl}/v1/info_widgets/`
//   // );
//   // var category_widgets_response = await fetch(
//   //   `${baseurl}/v1/category_widgets/`
//   // );
//   // var info_widgets = await info_widgets_response.json();
//   // var category_widgets = await category_widgets_response.json();

//   // return {
//   //   props: { info_widgets: [...info_widgets.data], category_widgets: [...category_widgets.data] }, // will be passed to the page component as props
//   // };
// }
