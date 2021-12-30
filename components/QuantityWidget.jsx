import { Button, Input, Row } from 'reactstrap'
import React, { Component } from 'react'
import { Col } from 'reactstrap'
import ItemQuantityWidget from './ItemQuantityWidget/ItemQuantityWidget'
import styles from './quantity_widget.module.scss'
export default class QuantityWidget extends Component {
    state ={
        quantity: 1,
    }
    


    render() {
        return (
            <Col md={12} className={styles.wrapper}>
                <div>Quantity: <ItemQuantityWidget addQuantity = {this.props.addQuantity} quantity={this.props.quantity} setQuantity={this.props.setQuantity} reduceQuantity = {this.props.reduceQuantity} onChange={this.props.onChange} /> </div>
               <Row className={styles.actionButtons}> 
                   <Col md={6}><Button color={"success"} size={"lg"}  onClick={this.props.addToCart} className="form-control" disabled={this.props.product.quantity <= 0 }>Add to Cart</Button>
                   </Col>
                   <Col md={6}><Button  color={"warning"} size={"lg"} onClick={this.props.buyNow} className='form-control' disabled={this.props.product.quantity <= 0 }>Buy Now</Button>
                   </Col>
                   </Row>
              </Col>
        )
    }
}
