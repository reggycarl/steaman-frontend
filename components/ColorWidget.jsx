import React, { Component } from 'react'
import { Col, Row } from 'reactstrap'

export default class ColorWidget extends Component {
    render() {
        return (
            <Col className='attrContainer'>
            <h6>Colors: </h6>
            <Col>
            <Row>
               { this.props.colors.length > 0 ? this.props.colors.map((color, i) =>  {
                    return <div className={`colorBox ${this.props.color_id == color.id ? "selected" : '' }`}onClick={ (e) => {
                        e.preventDefault();
                        this.props.onColorSelected(color)} }
                        >
                        <div className='inner 'style={{backgroundColor: `#${color.hex_code}`}} >
                            
                        </div>
                        {color.name}
                        </div>
                }) : "No Color Variants Available" }
                </Row>
                </Col>

                
            </Col>
        )
    }
}
