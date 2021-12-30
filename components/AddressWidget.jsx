import React, { Component } from 'react'
import { Col } from 'reactstrap'

export default class AddressWidget extends Component {
    render() {
        return (
            <Col><p>{this.props.address.first_name} {this.props.address.last_name} <br />
                    {this.props.address.address} <br />
                    Phone: {this.props.address.mobile_number} - Email: {this.props.address.email}
                    </p>
                    </Col>
        )
    }
}
