import React, { Component } from 'react'
import { Col, Row } from 'reactstrap';
import {baseurl} from '../../misc/Axios'
import SanitizeHTML from '../../misc/Sanitize';
import styles from './page.module.scss'
export default class Page extends Component {
    render() {
        return (
            <Col className={styles.wrapper}>
                <Row>
                  <Col md={12} className={"topSide"}>
                    <h2>{this.props.page ? this.props.page.title : "Page Not Found"} </h2>
                  </Col>
                </Row>
                <Row className='pageContent'>

                {this.props.page ? SanitizeHTML(this.props.page.content) : <Col md={12}><h1 className='centered'>Page Not Found</h1></Col>}
                    </Row>
                    </Col>
        )
    }
}

export async function getServerSideProps(context) {
    
    var page_id = context.params.page_id;
    var response = await fetch(
      `${baseurl}/v1/pages/${page_id}`
    );
    var page = await response.json();
    console.log(page);
    return {
      props: { ...page }, // will be passed to the page component as props
    };
  }
