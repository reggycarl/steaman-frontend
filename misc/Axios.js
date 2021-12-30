import axios from "axios";
// import { bindActionCreators } from 'redux';
// import * as actions from '../../actions'
// import { logout } from '../../actions/'
// import { connect } from 'react-redux'
// import { store } from '../../index'
import { toast } from "react-toastify";
import React from "react";
import _ from "lodash";
export var baseurl = process.env.NEXT_PUBLIC_BASEURL;
export var frontendbaseurl = process.env.NEXT_PUBLIC_RCAPTURE_SITE_KEY;
const axiosInstance = axios.create({
  baseURL: baseurl,
});

axiosInstance.interceptors.request.use(function (config) {
  config.headers = {
    "Content-Type": "application/json",
    "access-token": localStorage.getItem("steaman-access-token"),
    uid: localStorage.getItem("steaman-uid"),
    client: localStorage.getItem("steaman-client"),
  };
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Returning Response", response);
    if (response.status == 202) {
      toast.success(response.data.message);
    }
    if (response.status == 200 && !_.isEmpty(response.data.message)) {
      toast.success(response.data.message);
    }
    if (response.status == 200 && !_.isEmpty(response.data.error)) {
      toast.error(response.data.error);
    }

    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log("THIS IS ERROR", error.response);
    if (error.response.status == 400) {
      console.log(error.response.data);
      toast.error(errorMessages(error.response.data));
      // store.dispatch(logout())
    }
    if (error.response.status == 401) {
      toast.error(errorMessages(error.response.data));
      // store.dispatch(logout())
      localStorage.removeItem("steaman-user");
      localStorage.removeItem("steaman-access-token");
      localStorage.removeItem("steaman-uid");
      localStorage.removeItem("steaman-client");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
    if (error.response.status == 404) {
      toast.error(errorMessages(error.response.data));
      // store.dispatch(logout())
    }
    return Promise.reject(error);
  }
);

export function errorMessages(errors) {
  console.log(errors);
  var string = [];
  var keys = Object.keys(errors.errors);
  errors = errors.errors;
  if ("full_messages" in errors) {
    keys.map((row, i) => {
      console.log("THIS IS ROW", row);
      if (row == "full_messages") {
        // return false;
        string.push(<li>{errors[row]}</li>);
      }
    });
  } else {
    keys.map((row, i) => {
      console.log("THIS IS ROW", row);
      if (row == "full_messages") {
        // return false;
        string.push(<li>{errors[row]}</li>);
      } else if (Number.isInteger(row)) {
        string.push(<li>{errors[row]}</li>);
      } else {
        var new_row = row.replace("_", " ");
        new_row = new_row.charAt(0).toUpperCase() + new_row.slice(1);
        string.push(<li>{errors[row]}</li>);
      }
      return string;
    });
  }

  return <ul>{string}</ul>;
}
// const mapStateToProps = (state) => {
//     return (
//         { user: state.authentication.user, token: state.authentication.token }
//     )
// }
// const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })
// export default connect(mapStateToProps, mapDispatchToProps)(axiosInstance);
export default axiosInstance;
