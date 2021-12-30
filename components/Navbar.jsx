import React, { Compponent } from "react";
import Link from "next/link";
import {
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  NavbarToggler,
  Collapse,
  DropdownToggle,
  NavbarText,
  Button,
  Col,
  Row,
} from "reactstrap";
import { BiLogIn } from "react-icons/bi";
import { FiBox } from "react-icons/fi";
import {
  FaUser,
  FaBox,
  FaSearch,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaBars,
  FaChevronCircleRight,
  FaCartArrowDown,
  FaShoppingBasket,
  FaShoppingCart,
  FaStarAndCrescent,
  FaComments,
  FaGrinStars,
  FaStar,
} from "react-icons/fa";
import { MdFace, MdHelp, MdLiveHelp, MdShoppingCart } from "react-icons/md";
import styles from "./Navbar.module.scss";
import UserContext from "./UserContext";
import CategoryMenuWidget from "../components/CategoryMenuWidget/CategoryMenuWidget";
import _ from "lodash";
import Router from "next/router";
import CategoriesBar from "./CategoriesBar/CategoriesBar";
import SearchWidget from "./SearchWidget/SearchWidget";

// import styles from  './Navbar.module.scss';
export default class CustomNavbar extends React.Component {
  static contextType = UserContext;
  state = {
    isOpen: false,
    search_term: "",
  };
  toggle = () => {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
    });
  };

  onChange = (e) => {
    // e.preventDefault()
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };

  render() {
    return (
      <>
        <Navbar color="" light expand="md" id="mainNavBar">
          <div className="container-fluid ">
            <NavbarBrand>
              <Link href="/">
                <a>
                  <img
                    src="/images/logo-small-white-bg.png"
                    alt="Steaman Logo"
                    className="logo"
                  />
                </a>
              </Link>
            </NavbarBrand>
            <div
              className={`${styles.mobileMenu} .d-none .d-sm-block .d-md-none`}
            >
              <Link href="/account">
                <a>
                  <FaUser size={25} />
                </a>
              </Link>
              <Link href="cart">
                <a>
                  <FaShoppingCart size={25} />
                </a>
              </Link>
            </div>
            {/* <NavbarToggler onClick={this.toggle} /> */}

            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <Link
                    href="https://partners.steaman.com.gh"
                    className="nav-link"
                  >
                    <a target="_blank" className="nav-link text-nowrap">
                      Sell on Steaman
                    </a>
                  </Link>
                </NavItem>
              </Nav>
              <SearchWidget mobile={false} />
              <Nav className="mr-auto" navbar>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    {_.isEmpty(this.context.user)
                      ? "Login"
                      : this.context.user.first_name}
                  </DropdownToggle>
                  <DropdownMenu right className={styles.drop_down_menu}>
                    {this.context.loggedIn() ? (
                      ""
                    ) : (
                      <React.Fragment>
                        <DropdownItem>
                          <Link href="/login/">
                            <span>
                              <FaSignInAlt />
                              Login
                            </span>
                          </Link>
                        </DropdownItem>
                        <DropdownItem>
                          <Link href="/signup/">
                            <span>
                              <FaUserPlus /> Signup
                            </span>
                          </Link>
                        </DropdownItem>
                        <DropdownItem divider />
                      </React.Fragment>
                    )}
                    {this.context.loggedIn() ? (
                      <>
                        <DropdownItem>
                          <Link href="/account/" className="nav-link">
                            <span>
                              <FaUser />
                              My Account
                            </span>
                          </Link>
                        </DropdownItem>
                        <DropdownItem>
                          <Link href="/orders/" className="nav-link">
                            <span>
                              <FaBox />
                              My Orders
                            </span>
                          </Link>
                        </DropdownItem>
                        <DropdownItem>
                          <Link href="/product_reviews/" className="nav-link">
                            <span>
                              <FaStar />
                              Pending Reviews
                            </span>
                          </Link>
                        </DropdownItem>
                      </>
                    ) : (
                      ""
                    )}
                    {this.context.loggedIn() ? (
                      <DropdownItem>
                        <Button
                          className="nav-link form-control "
                          color="warning"
                          onClick={this.context.signOut}
                        >
                          <FaSignOutAlt /> Logout
                        </Button>
                      </DropdownItem>
                    ) : (
                      ""
                    )}
                  </DropdownMenu>
                </UncontrolledDropdown>
                {/* <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Support
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>
                      <Link
                        href="/content/contact-steaman"
                        className="nav-link text-nowrap"
                      >
                        Support Center
                      </Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link href="/faqs/">FAQs</Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link href="/support-center/">Track Orders</Link>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>
                      <Button color="primary">Live Chat</Button>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown> */}
                <NavItem>
                  <Link href="/content/contact-steaman/">
                    <a className="nav-link text-nowrap">
                      <MdLiveHelp className="nav-icon" /> Support
                    </a>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/cart/">
                    <a className="nav-link text-nowrap">
                      <MdShoppingCart className="nav-icon" /> Cart(
                      {this.context.cart.length})
                    </a>
                  </Link>
                </NavItem>
              </Nav>
            </Collapse>
          </div>
        </Navbar>

        <CategoriesBar
          categories={this.props.categories}
          categories_tree={this.props.categories_tree}
          category_groups={this.props.category_groups}
        />
      </>
    );
  }
}
