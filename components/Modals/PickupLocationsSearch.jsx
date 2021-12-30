import React, { Component } from 'react'
import { Col, FormGroup, Input, Button, Row, Label } from 'reactstrap'
import SubmitButton from '../Controls/SubmitButton'

import { FaArrowAltCircleRight, FaSearch } from 'react-icons/fa'
import { getCities, getRegions } from '../../misc/Functions'
import Select from "../../components/CustomSelect";
import Axios from 'axios'
import axiosInstance from '../../misc/Axios'
export default class PickupLocationsSearch extends Component {
   
   
    state = {
        pickup_locations: [],
        search_string: '',
        
        dtOptions1: {
            'paging': true, // Table pagination
            'ordering': true, // Column ordering
            'info': true, // Bottom left status text
            responsive: true,
            // Text translation options
            // Note the required keywords between underscores (e.g _MENU_)
            oLanguage: {
                sSearch: '<em class="fa fa-search"></em>',
                sLengthMenu: '_MENU_ records per page',
                info: 'Showing page _PAGE_ of _PAGES_',
                zeroRecords: 'Nothing found - sorry',
                infoEmpty: 'No records available',
                infoFiltered: '(filtered from _MAX_ total records)',
                oPaginate: {
                    sNext: '<em class="fa fa-caret-right"></em>',
                    sPrevious: '<em class="fa fa-caret-left"></em>'
                }
            }
        },
    }
    selectPickupLocation = (e)=>  {
        var result;
        console.log("ATTR", parseInt(e.target.getAttribute('data-item')));
        console.log("LOCATIONS", this.state.pickup_locations)
        var pickup_location = this.state.pickup_locations.find((current_pickup_location) => {
             return  current_pickup_location.id == parseInt(e.target.getAttribute('data-item'))
            });
            
        
        this.props.selectPickupLocation(pickup_location);
    }

    componentDidMount = () => {
        this.setRegions();
        
        
    }
    setRegions = () => {
        Axios.get("https://ipapi.co/json/")
          .then((response) => {
            let data = response.data;
       
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
        if (selectedOption == "region_id") {
          getCities(val.uuid).then((response) => {
            this.setState({
              ...this.state,
              city_id: null,
              cities: response,
            });
          });
        }
        if (selectedOption == "city_id") {
            axiosInstance.get(`/v1/pickup_locations/?city_id=${val.uuid}`).then(response => {
                this.setState({
                    ...this.state,
                    pickup_locations: response.data.data
                })
            })
           
          }
        var state = {
          ...this.state,
    
          order: {
            ...this.state.order,
            [selectedOption]: val.value,
          },
          [selectedOption]: val,
        };
        this.setState({ ...state });
      };
    render() {
        return (
            <Col>
                <form className="form-horizontal" onSubmit={this.onSubmit}>
                <Row>
                      <FormGroup className="col-md-6">
                        <Label for="exampleEmail">Region </Label>
                        <Select
                          name="region_id"
                          value={this.state.region_id}
                          onChange={this.handleChangeSelect.bind(
                            this,
                            "region_id"
                          )}
                          options={this.state.regions}
                          isDisabled={this.state.readOnly}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-6">
                        <Label for="exampleEmail">City </Label>
                        <Select
                          name="region_id"
                          value={this.state.city_id}
                          onChange={this.handleChangeSelect.bind(
                            this,
                            "city_id"
                          )}
                          options={this.state.cities}
                          isDisabled={this.state.readOnly}
                        />
                      </FormGroup>
                    </Row>
                </form>
                <table className="table table-striped my-4 w-100 table-bordered">
                    <thead>
                        <tr>
                            <th width='5%' data-priority="1">#</th>
                            <th width='55%' className="sort-alpha" data-piority="2">Pickup Location</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.pickup_locations.map((pickup_location, i) => {
                            return (
                            <React.Fragment key={i + 1}>
                            
                             
                                     <tr key={i + 1 }  data-item={pickup_location.id} name={pickup_location.id} onClick={this.selectPickupLocation}  >
                                        <td className='centered' data-item={pickup_location.id} name={pickup_location.id} ><FaArrowAltCircleRight  data-item={pickup_location.id}/></td>
                                        <td data-item={pickup_location.id} name={pickup_location.id} >
                                            {pickup_location.name}<br />
                                            <b>GPS Code: </b>{pickup_location.gps_code}<br />
                                            <b>Address: </b>{pickup_location.address}<br />
                                            <b>Contact Information: </b>{pickup_location.contact_information}<br />
                                        </td> 
                                    </tr>
                                
                                
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>

            </Col >
        )
    }
}
