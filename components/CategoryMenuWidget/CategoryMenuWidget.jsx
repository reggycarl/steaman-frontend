import Link from 'next/link'
import React, { Component } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Col, Row } from 'reactstrap'

export default class CategoryMenuWidget extends Component {
    render() {
        return (
            <Row>
                <Col md={12}>
                {this.props.categories.map((cat)=> {
                return (
                    <Link href={`/categories/${cat.uuid}`} >
                        <a>
                    <Col md={12} >
                    <div className><FaArrowRight /><span> {cat.name} </span></div>
                    </Col>
                    </a>
                    </Link>)
                })}
                </Col>
            </Row>
        )
    }
}
