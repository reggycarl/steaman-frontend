import { Button } from 'reactstrap'
import React, { Component } from 'react'
import { Col } from 'reactstrap'
import styles from './review_item.module.scss'
import Link from 'next/link'

export default class ReviewItem extends Component {
    render() {
        return (
            <Link href={`/product_reviews/${this.props.cart.uuid}`} >
                <a className={styles.linkWrapper}>
            <Col className={styles.wrapper}>
                <div className={styles.photoBox}>
                {this.props.cart.product.featured_photo != "" ||  this.props.cart.product.featured_photo != null ? <img src={this.props.cart.product.featured_photo} /> : "" }
                </div>
                <div className={styles.orderInfo}>
                    <p>{this.props.cart.order_number} <br />
                    <h4>{this.props.cart.product.name} </h4><br />
                    Color: {this.props.cart.color_name}  | Size: {this.props.cart.size_name}</p>
                    <Button size="sm" color='success'>{this.props.cart.status_name }</Button>
                </div>
                <br className='clear' />
            </Col>
            </a>
            </Link>
        )
    }
}
