import React from "react";
import { Col, Row } from "reactstrap";
import Image from "next/image";
import Link from "next/link";
import MailchimpSubscribe from "react-mailchimp-subscribe";
export default class Footer extends React.Component {
  render() {
    const url =
      "https://steaman.us1.list-manage.com/subscribe/post?u=82e8c359fd87a9de014055b4b&amp;id=03256e98f4";
    const SimpleForm = () => <MailchimpSubscribe url={url} />;
    return (
      <Col id="footer">
        <Row>
          <Col md={3}>
            <img
              src="/images/logo_white_small.png"
              alt="Steaman Online Logo"
              className="logo"
            />
            <h4>About Steaman</h4>
            <ul>
              <li>
                <Link href={"/content/about-steaman"}>
                  <a>About Us</a>
                </Link>
              </li>
              <li>
                <Link href={"/content/contact-steaman"}>
                  <a>Contact Us</a>
                </Link>
              </li>
              <li>
                <Link href={"/content/steaman-terms-and-conditions"}>
                  <a>Term &amp; Conditions</a>
                </Link>
              </li>
              <li>
                <Link href={"/content/steaman-privacy-policy"}>
                  <a>Privacy Policy</a>
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={3}>
            <h4>Shopping on Steaman</h4>
            <ul>
              <li>
                <Link href={"/content/faqs-steaman"}>
                  <a>FAQs</a>
                </Link>
              </li>
              {/* <li>Delivery</li> */}
              <li>
                <Link href={"/content/steaman-return-policy"}>
                  <a>Steaman Return Policy</a>
                </Link>
              </li>
              {/* <li><Link href={"/content/about-steaman"}><a>Track My Order</a></Link></li> */}
            </ul>
            <h4>Payment Options</h4>
            <Row>
              <Col className="payment_methods">
                <Link href={"/content/steaman-payment-options"}>
                  <a>
                    <Image
                      width={70}
                      height={20}
                      src="/images/visa_master_card.png"
                      alt="Visa and master card accepted by steaman Logo"
                    />
                  </a>
                </Link>
                <Link href={"/content/steaman-payment-options"}>
                  <a>
                    {" "}
                    <Image
                      width={30}
                      height={20}
                      src="/images/mtn_mobile_money.png"
                      alt="MTN Mobile Money Accepted by Steaman Logo"
                    />
                  </a>
                </Link>
                <Link href={"/content/steaman-payment-options"}>
                  <a>
                    <Image
                      width={70}
                      height={20}
                      src={"/images/airtel_tigo_money.png"}
                      alt="AirtelTigo Money Accepted by Steaman Logo"
                    />
                  </a>
                </Link>

                <Link href={"/content/steaman-payment-options"}>
                  <a>
                    <Image
                      width={40}
                      height={20}
                      src={"/images/vodafone-cash-logo.png"}
                      alt="Vodafon Cash Accepted by Steaman Logo"
                    />
                  </a>
                </Link>
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            <h4>Selling on Steaman</h4>
            <ul>
              <li>
                <Link href={"/content/become-a-steaman-partner"}>
                  <a>Become a Steaman Partner</a>
                </Link>
              </li>
            </ul>
            <h4>Stay Informed</h4>
            <p>Subscribe to our Newsletter</p>
            <MailchimpSubscribe
              url={url}
              render={({ subscribe, status, message }) => (
                <div>
                  <SimpleForm onSubmitted={(formData) => subscribe(formData)} />
                  {status === "sending" && (
                    <div style={{ color: "yellow" }}>sending...</div>
                  )}
                  {status === "error" && (
                    <div
                      style={{ color: "red" }}
                      dangerouslySetInnerHTML={{ __html: message }}
                    />
                  )}
                  {status === "success" && (
                    <div style={{ color: "green" }}>Subscribed !</div>
                  )}
                </div>
              )}
            />
          </Col>
          <Col md={3} className="appStoreIcons">
            <h4>Download Our App</h4>
            <Row>
              <Link href="https://apps.apple.com/us/app/steaman/id1564638634">
                <a>
                  <img
                    src="/images/steaman_app_apple_app_store.png"
                    alt="Downloaad Steaman App from Apple App Store"
                    // width="auto"
                  />
                </a>
              </Link>
              <Link href="https://play.google.com/store/apps/details?id=com.steaman.steaman_mobile">
                <a>
                  <img
                    src="/images/steaman_app_google_play_store.png"
                    alt="Downloaad Steaman App from Google Play Store"
                    // width="auto"
                  />
                </a>
              </Link>
            </Row>
          </Col>
        </Row>
      </Col>
    );
  }
}
