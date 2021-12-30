import React from 'react';
import { FaThinkPeaks } from 'react-icons/fa';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axiosInstance from '../../misc/Axios';
import { getRegions } from '../../misc/Functions';
import PickupLocationsSearch from './PickupLocationsSearch';

class PickupLocationsModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: this.props.isOpen,
            pickup_location_groups: []
        };

        this.toggle = this.toggle.bind(this);
    }
    
    componentDidMount = () => {
        // axiosInstance.get("/v1/pickup_locations").then(response => {
        //     console.log("THES ARE LOCATIONS", response.data);
        //     this.setState({
        //         ...this.state,
        //         pickup_location: response.data.data
        //     })
            
        // })

       
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <div>

                <Modal isOpen={this.props.isOpen} modalTransition={{ timeout: 100 }} backdropTransition={{ timeout: 100 }}  size={"lg"}
                    toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.props.toggle.bind(this.props.parentForm)}>Select PickupLocations</ModalHeader>
                    <ModalBody>
                        <PickupLocationsSearch  selectPickupLocation={this.props.selectPickupLocation} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.props.toggle.bind(this.props.parentForm)}>OK</Button>{' '}
                        <Button color="secondary" onClick={this.props.toggle.bind(this.props.parentForm)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default PickupLocationsModal;