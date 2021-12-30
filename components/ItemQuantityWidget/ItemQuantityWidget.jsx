
import React, { Component } from 'react'
import { Input, Button } from 'reactstrap'
import styles from './item_quantity.module.scss'
export default class ItemQuantityWidget extends Component {

    render() {
        return (
            <div className={`${styles.wrapper}`}>
            <div className={` input-group`}>
                <div class="input-group-prepend"> <Button size={this.props.size || "md"} onClick={(e) => this.props.reduceQuantity(this.props.cart)} className="btn-outline-secondary" color={"default"}>-</Button></div>
                <Input size={this.props.size || "md"} name={"quantity"} style={{width: "40px" ,display: 'inline'}} type={"number"} value = {this.props.quantity} onBlur={(e) => this.props.setQuantity(this.props.cart, e.target.value )} onChange={(e) => this.props.onChange(e, this.props.cart)} />
                <div class="input-group-append"> <Button size={ this.props.size || "md"} onClick={(e) => this.props.addQuantity(this.props.cart)} className="btn-outline-secondary" color={"default"} >+</Button></div>
            </div>
            </div>
        )
    }
}
