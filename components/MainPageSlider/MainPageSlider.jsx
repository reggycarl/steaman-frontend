import {
  Carousel,
  Col,
  CarouselItem,
  CarouselCaption,
  CarouselIndicators,
  CarouselControl,
} from "reactstrap";
import React, { Component } from "react";
import Slider from "react-slick";

import styles from "./MainPageSlider.module.scss";
import axiosInstance, { baseurl } from "../../misc/Axios";
import Link from "next/link";

export default class MainPageSlider extends Component {
  state = {
    activeIndex: 0,
    sliders: [],
    items: [],
  };
  componentDidMount = () => {
    console.log("SLIDERS MOUNTED....");
    axiosInstance.get("/v1/sliders").then((response) => {
      console.log(response.data);
      this.setState({
        ...this.state,
        sliders: response.data.sliders,
        items: response.data.sliders.map((slide, index) => {
          return {
            src: slide.photo.image_url,
            link: slide.link,
          };
        }),
      });
    });
  };
  next = () => {
    if (this.state.animating) return;
    const nextIndex =
      this.state.activeIndex === this.state.items.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({
      ...this.sttate,
      activeIndex: nextIndex,
    });
  };

  previous = () => {
    if (this.state.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? this.state.items.length - 1
        : this.state.activeIndex - 1;
    this.setState({
      ...this.state,
      activeIndex: nextIndex,
    });
  };

  goToIndex = (newIndex) => {
    if (this.state.animating) return;
    this.setState({
      activeIndex: newIndex,
    });
  };
  handleDragStart = (e) => e.preventDefault();

  render() {
    const slides = this.state.items.map((item) => {
      return (
        <CarouselItem
          className={"h-100"}
          onExiting={() => this.setState({ ...this.state, animating: true })}
          onExited={() => this.setState({ ...this.state, animating: false })}
          key={item.src}
        >
          <Link href={item.link || "/"}>
            <a>
              <img src={item.src} alt={item.altText} />
            </a>
          </Link>
          <CarouselCaption
            captionText={item.caption}
            captionHeader={item.caption}
          />
        </CarouselItem>
      );
    });

    return (
      <div className={`${styles.wrapper} h-100`}>
        <Carousel
          // interval={false}
          className={"h-100"}
          activeIndex={this.state.activeIndex}
          next={this.next}
          previous={this.previous}
        >
          <CarouselIndicators
            items={this.state.items}
            activeIndex={this.state.activeIndex}
            onClickHandler={this.goToIndex}
          />
          {slides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={this.previous}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={this.next}
          />
        </Carousel>
      </div>
    );
  }
}
