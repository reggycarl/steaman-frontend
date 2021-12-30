import React, { Component } from "react";
import { Input } from "reactstrap";

import styles from "./sidebar.module.scss";
export default class SideBar extends Component {
  state = { brand_id: [], color_id: [], size_id: [] };
  onCheckBoxChange = (e) => {
    console.log(e);
    console.log(e.target.name);
    console.log(e.target.checked);
    console.log(`changins State of ${e.target.name}`, e.target.value);
    console.log("Current State", this.state[e.target.name]);

    var new_state = {
      ...this.state,
    };
    var temp_val = [...this.state[e.target.name]];

    var temp_index = temp_val.indexOf(e.target.value);
    console.log("THIS IS INDEX", temp_index);
    if (temp_index >= 0 && e.target.checked == false) {
      temp_val.splice(temp_index, 1);
    } else if (temp_index >= 0 && e.target.checked == true) {
    } else if (temp_index < 0 && e.target.checked == true) {
      temp_val.push(e.target.value);
    } else {
    }
    console.log("THIS IS TEMP VAL", temp_val);
    new_state = {
      ...new_state,
      [e.target.name]: [...temp_val],
    };
    console.log("THIS IS NEW STATE", new_state);
    // var colors = new_state.color_id.filter((obj) => obj.value == true);
    var colors = Object.entries(new_state.color_id).filter((key, val) => {
      return val == true;
    });
    console.log("THESE ARE COLORS", colors);
    this.props.sideBarFilter(
      new_state.brand_id,
      new_state.color_id,
      new_state.size_id
    );
    this.setState({
      ...new_state,
    });
  };
  render() {
    return (
      <div className={`${styles.sidebar} d-none d-sm-block`}>
        <h5>Brands</h5>
        <ul>
          {this.props.brands.map((brand, i) => {
            return (
              <li>
                <label class="container">
                  {brand.name}
                  <Input
                    type="checkbox"
                    name={`brand_id`}
                    disabled={this.state.placingOrder}
                    // defaultChecked={this.state[`brand_id`] || false}
                    value={brand.uuid}
                    onChange={this.onCheckBoxChange}
                  />
                  <span class="checkmark"></span>
                </label>
              </li>
            );
          })}
        </ul>
        <h5>Sizes</h5>
        <ul>
          {this.props.sizes.map((size, i) => {
            return (
              <li>
                <label class="container">
                  {size.name}
                  <Input
                    type="checkbox"
                    name={`size_id`}
                    disabled={this.state.placingOrder}
                    value={size.uuid}
                    onChange={this.onCheckBoxChange}
                  />
                  <span class="checkmark"></span>
                </label>
              </li>
            );
          })}
        </ul>
        <h5>Colors</h5>
        <ul>
          {this.props.colors.map((color, i) => {
            return (
              <li>
                <label class="container">
                  {color.name}
                  <Input
                    type="checkbox"
                    name={`color_id`}
                    disabled={this.state.placingOrder}
                    value={color.uuid}
                    className={"custom"}
                    onChange={this.onCheckBoxChange}
                  />
                  <span class="checkmark"></span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
