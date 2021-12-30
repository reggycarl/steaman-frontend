import React, { Component } from 'react'
import { Col, Row } from 'reactstrap'

export default class SizesWidget extends Component {
    render() {
        return (
            <Col className='attrContainer'>
            <h6>Sizes: </h6>
            <Col>
            <Row>
            {this.props.sizes.length > 0 ? this.props.sizes.map((size, i) =>  {
                    return <div onClick ={(e) => {e.preventDefault(); this.props.onSizeSelected(size)}} className={`sizeBox ${this.props.size_id == size.id ? "selected" : "" } `}>
                        {size.name}
                        </div>
                }) : "No Size Variants Available" }
                </Row> 
                </Col>

                
            </Col>
        )
    }
}
