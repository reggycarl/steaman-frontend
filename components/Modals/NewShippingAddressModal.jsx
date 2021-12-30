import Axios from "axios";
import React, { Component } from "react";

import {
  FormGroup,
  Label,
  Row,
  Input,
  ModalFooter,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import axiosInstance from "../../misc/Axios";
import { getCities, getRegions } from "../../misc/Functions";
import Select from "../CustomSelect";
export default class NewShippingAddressModal extends Component {
  state = {
    shipping_address: {
        first_name: "",
        las_name: "",
        region_id: null,
        city_id: null,
        phone: "",
        address: "",
    },
  };

  handleChangeSelect = () => {};

  componentDidMount = () => {
    this.setRegions();
  };
  onChange = (e) => {
    this.setState({
        ...this.state,
        shipping_address: {
            ...this.state.shipping_address,
            [e.target.name]: e.target.value
        }
        
    })
}

  setRegions = () => {
      console.log("SETTING REGIONS")
    Axios.get("https://ipapi.co/json/")
      .then((response) => {
        let data = response.data;
        console.log("THIS IS COUNTRY", data);
        // this.setState({
        //     countryName: data.country_name,
        //     countryCode: data.country_calling_code
        // });
        console.log(data);
        axiosInstance
          .get(`/v1/countries/${data.country_name}?by_name=true`)
          .then((countryResponse) => {
            if (countryResponse.status == 200) {
              var country_uuid = countryResponse.data.country.uuid;
              console.log("COUNTRY UUID", country_uuid);
              getRegions(country_uuid).then((regionResponse) => {
                console.log(regionResponse);
                this.setState({
                  ...this.state,
                  regions: regionResponse,
                });
              });
            }
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  handleChangeSelect = (selectedOption, val) => {
      console.log("THIS IS SELECTED VALUE", val);
    if (selectedOption == "region_id") {
      getCities(val.uuid).then((response) => {
        this.setState({
          ...this.state,
          
          city_id: null,
          cities: response,
        });
      });
    }
    var state = {
      ...this.state,

      shipping_address: {
        ...this.state.shipping_address,
        [selectedOption]: val.value,
      },
      [selectedOption]: val,
    };
    this.setState({ ...state });
  };
  submit = (e) => {
      e.preventDefault();

       axiosInstance.post(
        `/v1/users/shipping_addresses`,
        { shipping_address: this.state.shipping_address }
      ).then(response => {
          if(response.status == 200){
            this.props.setAddressesWithAddress(response.data.shipping_address, response.data.shipping_addresses)
            this.props.toggle.bind(this.props.parentForm)
              // this.setState({
              //     ...this.state,
              //     readOnly: true
              // })
              
          }
          console.log(response);
      })
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
        size={"lg"}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.props.toggle.bind(this.props.parentForm)}>
          Create a new Delivery Address
        </ModalHeader>
        <ModalBody>
          <Row>
            <FormGroup className="col-md-6">
              <Label for="exampleEmail">First Name</Label>
              <Input
                type="text"
                name="first_name"
                value={this.state.shipping_address.first_name}
                placeholder="First Name "
                onChange={this.onChange}
                readOnly={this.state.readOnly}
              />
            </FormGroup>
            <FormGroup className="col-md-6">
              <Label for="exampleEmail">Last Name</Label>
              <Input
                type="text"
                name="last_name"
                value={this.state.shipping_address.last_name}
                placeholder="Last Name "
                onChange={this.onChange}
                readOnly={this.state.readOnly}
              />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-12">
              <Label for="exampleEmail">Email</Label>
              <Input
                type="email"
                name="email"
                value={this.state.shipping_address.email}
                placeholder="user@email.com "
                onChange={this.onChange}
                readOnly={this.state.readOnly}
              />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-12">
              <Label for="exampleEmail">Mobile Number</Label>
              <Input
                type="text"
                name="mobile_number"
                value={this.state.shipping_address.mobile_number}
                placeholder="000000000 "
                onChange={this.onChange}
                readOnly={this.state.readOnly}
              />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-12">
              <Label for="exampleEmail">Digital Address </Label>
              <Input
                type="text"
                name="digital_address"
                rows={5}
                value={this.state.shipping_address.digital_address}
                placeholder="GA-0000-0000 "
                onChange={this.onChange}
                readOnly={this.state.readOnly}
              />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-12">
              <Label for="exampleEmail">Address </Label>
              <Input
                type="textarea"
                name="address"
                rows={5}
                value={this.state.shipping_address.address}
                placeholder="Hse No / Street Name / Building / Apartment No. / Floor "
                onChange={this.onChange}
                readOnly={this.state.readOnly}
              />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-6">
              <Label for="exampleEmail">Region </Label>
              <Select
                name="region_id"
                value={this.state.region_id}
                onChange={this.handleChangeSelect.bind(this, "region_id")}
                options={this.state.regions}
                isDisabled={this.state.readOnly}
              />
            </FormGroup>
            <FormGroup className="col-md-6">
              <Label for="exampleEmail">City </Label>
              <Select
                name="city_id"
                value={this.state.city_id}
                onChange={this.handleChangeSelect.bind(this, "city_id")}
                options={this.state.cities}
                isDisabled={this.state.readOnly}
              />
            </FormGroup>
          </Row>
          <Button onClick={this.submit} color={"success"} className="form-control">Create Address </Button>
        </ModalBody>
        <ModalFooter>
          {/* <Button
            color="primary"
            onClick={this.props.toggle.bind(this.props.parentForm)}
          >
            OK
          </Button>{" "} */}
          <Button
            color="secondary"
            onClick={this.props.toggle.bind(this.props.parentForm)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
