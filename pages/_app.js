import "../styles/globals.scss";

import "bootstrap/dist/css/bootstrap.min.css";
import App from "next/app";
import Router from "next/router";
import UserContext from "../components/UserContext";
import axiosInstance, { baseurl } from "../misc/Axios";
import _ from "lodash";

// import {baseurl}
import axios from "axios";
import Layout from "../misc/Layout";
import { toast } from "react-toastify";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import ReactGA from "react-ga";
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
export default class MyApp extends App {
  state = {
    user: null,
    categories: [],
    categories_tree: [],
    category_groups: [],
    cart: [],
  };
  signIn = (username, password) => {
    axios
      .post(baseurl + "/accounts/sign_in", {
        email: username,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        if (response.status == 200) {
          var user = response.data.data;
          localStorage.setItem("steaman-user", JSON.stringify(user));
          localStorage.setItem(
            "steaman-access-token",
            response.headers["access-token"]
          );
          localStorage.setItem("steaman-uid", response.headers["uid"]);
          localStorage.setItem("steaman-client", response.headers["client"]);
          console.log("THIS IS HEADER", response.headers);
          var current_carts = localStorage.getItem("cart");
          if (current_carts != null && current_carts != "") {
            current_carts = JSON.parse(current_carts);
            for (var index in current_carts) {
              console.log("THIS IS CURRENT CART IN SIGNIN", index);
              axiosInstance
                .post("/v1/users/carts", { cart: current_carts[index] })
                .then((response) => {
                  console.log("THIS IS RESPONSE FROM CART", response.data);
                  if (response.status == 200) {
                    this.setCart(response.data.cart);
                  }
                });
            }
            localStorage.removeItem("cart");
          }
          toast.success(" Logged In");
          this.setState(
            {
              ...this.state,
              user: {
                ...user,
              },
            },

            () => {
              Router.push("/");
            }
          );
        } else {
          toast.success(" Logged In");
        }
      })
      .catch((error) => {
        console.log("ERROR", error.response);
        toast.error("An error occured");
      });
  };

  setUser = (user, ref) => {
    this.setState(
      {
        ...this.state,
        user: {
          ...user,
        },
      },

      () => {
        Router.push("/" + ref);
      }
    );
  };
  loggedIn = () => {
    if (!_.isEmpty(this.state.user)) {
      return true;
    }
    return false;
  };
  setCart = (cart) => {
    console.log("ADDING TO CART...", cart);
    this.setState({
      ...this.state,
      cart: cart,
    });
  };
  signOut = () => {
    localStorage.removeItem("steaman-user");
    localStorage.removeItem("steaman-access-token");
    localStorage.removeItem("steaman-uid");
    localStorage.removeItem("steaman-client");

    this.setState({
      user: {},
      cart: [],
    });
    Router.push("/");
  };
  addToCart(cart) {
    if (this.loggedIn() == true) {
      console.log("ADDING TO CART");
      axiosInstance
        .post("/v1/users/carts", {
          cart: cart,
        })
        .then((response) => {
          console.log(response);
          this.setCart(response.data.cart);
        });
    } else {
      if (cart.product.quantity < cart.quantity) {
        toast.error(
          `Quantity selected of ${cart.quantity}  is more that the quantity available for this product`
        );
        return false;
      } else if (cart.product.colors.length > 1 && cart.color_id == null) {
        toast.error(`Kindly select a color`);
        return false;
      } else if (cart.product.sizes.length > 1 && cart.size_id == null) {
        toast.error(`Kindly select a size`);
        return false;
      } else {
        var cartarray = localStorage.getItem("cart");
        if (cartarray != null && cartarray != "") {
          console.log(cartarray);
          console.log("USING 1");
          cartarray = JSON.parse(cartarray);
          console.log("THIS IS CURRENT CART ARRAY", cartarray);
        } else {
          console.log("USING 2");
          cartarray = [];
        }
        var current_index = cartarray.findIndex((ele) => {
          return ele.product_id == cart.product_id;
        });
        if (current_index >= 0) {
          cartarray[current_index] = cart;
        } else {
          cartarray.push(cart);
        }
        localStorage.setItem("cart", JSON.stringify(cartarray));
        console.log("NOT LOGGED IN WITH CART ", cart);
        toast.success(
          `${cart.quantity} x ${cart.product.name} Successfully Added to Cart`
        );
        this.setCart(cartarray);
      }
    }
    return true;
  }
  getCart() {
    if (this.loggedIn()) {
      console.log("GETTING CART", this.state);
      axiosInstance.get("/v1/users/carts").then((cartData) => {
        this.setState({
          ...this.state,
          cart: cartData.data.cart,
        });
      });
    } else {
      var current_cart = localStorage.getItem("cart");
      if (current_cart != null && current_cart != "") {
        current_cart = JSON.parse(current_cart);
        this.setState({
          ...this.state,
          cart: current_cart,
        });
      }
    }
  }

  componentDidMount = () => {
    ReactGA.initialize("G-QZZMKRV2FD");
    ReactGA.pageview(window.location.pathname + window.location.search);
    console.log("MOUNTING APP");
    axiosInstance.get("/v1/categories?type=roots").then((categoriesData) => {
      console.log("THIS IS CAT", categoriesData);
      this.setState({
        ...this.state,
        categories: categoriesData.data.data,
      });
    });
    axiosInstance.get("/v1/categories?type=tree").then((categoriesData) => {
      console.log("THIS IS CAT", categoriesData);
      this.setState({
        ...this.state,
        categories_tree: categoriesData.data.data,
      });
    });

    axiosInstance.get("/v1/category_groups").then((response) => {
      if (response.status == 200) {
        this.setState({
          ...this.state,
          category_groups: response.data.data,
        });
      }
    });

    const user = JSON.parse(localStorage.getItem("steaman-user"));
    console.log("MOUNTED WITH ", user);
    if (user) {
      console.log("SEETING USER...", user);
      this.getCart();
      this.setState({
        ...this.state,
        user: user,
      });
    } else {
      this.getCart();
      // Router.push('/login');
    }
  };

  render() {
    console.log("RENDERINg MAIN APP...", this.state.user);
    const { Component, pageProps } = this.props;

    return (
      <UserContext.Provider
        value={{
          user: this.state.user,
          cart: this.state.cart,
          signIn: this.signIn,
          signOut: this.signOut,
          loggedIn: this.loggedIn,
          setCart: this.setCart,
          addToCart: this.addToCart,
          setUser: this.setUser,
          categories: this.state.categories,
        }}
      >
        <Layout
          categories={this.state.categories}
          categories_tree={this.state.categories_tree}
          category_groups={this.state.category_groups}
        >
          <Component {...pageProps} categories={this.state.categories} />
        </Layout>
      </UserContext.Provider>
    );
  }
}

// MyApp;
