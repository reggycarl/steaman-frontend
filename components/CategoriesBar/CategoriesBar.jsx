import Link from "next/link";
import Router from "next/router";
import React, { Component } from "react";
import { FaBars, FaChevronCircleRight, FaSearch } from "react-icons/fa";
import { Col, Row, Button, Container } from "reactstrap";
import axiosInstance from "../../misc/Axios";
import SearchWidget from "../SearchWidget/SearchWidget";

export default class CategoriesBar extends Component {
  state = {
    showSubMenus: false,
    showMenu: false,
    categories_tree: [],
    category_groups: [],
  };
  onChange = (e) => {
    // e.preventDefault()
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };

  showMenu = (e) => {
    console.log(e.target.name);
    this.setState({
      ...this.state,
      showMenu: true,
    });
    clearTimeout(this.timer_id);
  };
  componentDidMount = () => {};
  hideMenu = (e) => {
    // console.log(e)
    // this.timer()
    this.setState({
      ...this.state,
      showMenu: false,
    });
  };
  clicked = (e) => {
    console.log(e);
    console.log("MENU WAS clicked on menu");
    this.setState({
      showSubMenus: false,
      showMenu: false,
    });
  };
  showSubMenus = (id, e) => {
    console.log("THIS IS ID", id);
    var current_category_id =
      id === parseInt(id, 10) ? id : this.state.current_category_id;
    this.setState({
      ...this.state,
      showSubMenus: true,
      showMenu: true,
      current_category_id: current_category_id,
    });
    clearTimeout(this.timer_id);
  };
  hideSubMenus = (e) => {
    // console.log(e)
    // this.timer()
    this.setState({
      ...this.state,
      showSubMenus: false,
      showMenu: false,
    });
  };
  render() {
    console.log("THIS IS current_category_id", this.state.current_category_id);
    var current_sub = this.props.categories_tree.find((cat) => {
      console.log("THIS IS CAT", cat);
      return cat.id == this.state.current_category_id;
    });
    console.log("THIS IS current_sub", current_sub);
    return (
      <>
        <div className="categoriesBarContainer">
          <div md={12} className="categoriesBar">
            <ul className="h-100">
              <li className="h-100">
                <a onMouseEnter={this.showMenu} onMouseLeave={this.hideMenu}>
                  <FaBars />
                  <span> All Categories </span>
                </a>
              </li>
              {this.props.category_groups.map((cat) => {
                return (
                  <li>
                    <Link href={`/category_groups/${cat.slug}`}>
                      <a>
                        <FaChevronCircleRight />
                        <span> {cat.name} </span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* <Col> */}

          <Col id="categoriesSheetContainer">
            <Row>
              <Col
                id="CategoriesSheet"
                md={12}
                style={{
                  display:
                    this.state.showMenu == true ? "inline-block" : "none",
                }}
              >
                <div className="menuSideBar">
                  <Row>
                    <Col
                      md={12}
                      className="inner "
                      onMouseEnter={this.showSubMenus}
                      onMouseLeave={this.hideSubMenus}
                    >
                      <ul>
                        {this.props.categories.map((cat) => {
                          return (
                            <Link href={`/categories/${cat.slug}`}>
                              <a onClick={this.clicked}>
                                <li
                                  name={this.uuid}
                                  onMouseEnter={this.showSubMenus.bind(
                                    this,
                                    cat.id
                                  )}
                                >
                                  <FaChevronCircleRight color={"#eeac11"} />{" "}
                                  {cat.name}
                                </li>
                              </a>
                            </Link>
                          );
                        })}
                      </ul>
                    </Col>
                  </Row>
                </div>
                <div
                  className="menuContent"
                  onMouseEnter={this.showSubMenus}
                  onMouseLeave={this.hideSubMenus}
                >
                  <Col
                    className="subMenuBox h-100"
                    style={{
                      display:
                        this.state.showSubMenus == true
                          ? "inline-block"
                          : "none",
                    }}
                    onMouseEnter={this.showSubMenus}
                    onMouseLeave={this.hideSubMenus}
                  >
                    <Row>
                      {current_sub
                        ? current_sub.children.map((cat) => {
                            return [
                              <Col md={2} className="menuPillContainer">
                                <Link href={`/categories/${cat.slug}`}>
                                  <a onClick={this.clicked}>
                                    <div className="menuPill">{cat.name}</div>
                                  </a>
                                </Link>
                              </Col>,
                              ...cat.children.map((ch) => {
                                return (
                                  <Col md={2} className="menuPillContainer">
                                    <Link href={`/categories/${ch.slug}`}>
                                      <a onClick={this.clicked}>
                                        <div className="menuPill">
                                          {ch.name}
                                        </div>
                                      </a>
                                    </Link>
                                  </Col>
                                );
                              }),
                            ];
                          })
                        : ""}
                    </Row>
                  </Col>
                </div>
                <br className="clear" />
              </Col>
            </Row>
          </Col>
          {/* </Col>         */}
        </div>
        <SearchWidget mobile={true} />
      </>
    );
  }
}
