import React from "react";
import { Col, Row } from "reactstrap";
import Link from "next/link";
import styles from "./banner_widget_box.module.scss";
export default function index(props) {
  return (
    <Col className={`${styles.box}`}>
      {props.widget ? (
        <Link href={props.widget.link}>
          <a>
            <img src={props.widget.photo.image_url} />{" "}
          </a>
        </Link>
      ) : (
        ""
      )}
    </Col>
  );
}
