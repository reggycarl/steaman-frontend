import React, { Component } from 'react'

import { FormGroup, Label, Row , Input, ModalFooter, Button, Modal, ModalHeader, ModalBody, Col} from 'reactstrap'
import axiosInstance from '../../misc/Axios'
import AddressWidget from '../AddressWidget'
import Select from '../CustomSelect'
import styles from './shipping_addresses_modal.module.scss'
export default class ShippingAddressesModal extends Component {
    state = {
        address: {},
        addresses: []
    }

    handleChangeSelect = () => {

    }

    componentDidMount = () => {
      console.log("MODAL MOUNTED")
      
    }
    render() {
        return (
            <Modal isOpen={this.props.isOpen} modalTransition={{ timeout: 100 }} backdropTransition={{ timeout: 100 }}  size={"lg"}
                    toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.props.toggle.bind(this.props.parentForm)}>Select Your Shipping Address</ModalHeader>
                    <ModalBody className={styles.wrapper}>
                  {this.props.addresses.length > 0 ? <ul> {this.props.addresses.map(add => {
                    return <li onClick={ e => this.props.selectShippingAddress(add)} className={`${this.props.shipping_address_id == add.id ? styles.selected : ""}`}><AddressWidget address={add} /> </li>
                  })} </ul>: <div className='centered'><p>Your Don't have any saved Addresses <br /> 
                  <Button color="success" size={"md"} onClick={this.props.toggleNewShippingAddressModal}>Create an Address</Button>
                  </p> </div>}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.props.toggle.bind(this.props.parentForm)}>OK</Button>{' '}
                        <Button color="secondary" onClick={this.props.toggle.bind(this.props.parentForm)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
        )
    }
}
