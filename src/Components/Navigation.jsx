import { Fragment, useState, useContext } from "react";
import { Container, Modal, Nav, Navbar, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { WalletContext } from "../Context/WalletContext";
import Metamask from "../assets/img/metamask.svg";
import "./Navigation.scss";
import { isMobile } from 'react-device-detect';

const Navigation = () => {
  const { walletModal, setWalletModal, connectWallet, accountId } =
    useContext(WalletContext);
  const [showMore, setShowMore] = useState(false);
  const handleClose = () => setWalletModal(false);
  const handleShow = () => setWalletModal(true);

  return (
    <Fragment>
      <Modal
        size="lg"
        className="wallet__model"
        show={walletModal}
        onHide={handleClose}
      >
        <Modal.Body>
          <div className="d-flex justify-content-end">
            <button className="close__btn" onClick={handleClose}>
              <svg
                width="45"
                height="45"
                viewBox="0 0 45 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.5 0C10.0727 0 0 10.0727 0 22.5C0 34.9273 10.0727 45 22.5 45C34.9273 45 45 34.9273 45 22.5C45 10.0727 34.9273 0 22.5 0ZM33.9963 29.3473C34.6329 29.984 34.9573 30.8309 34.9573 31.6718C34.9573 32.5127 34.639 33.3536 33.9963 33.9963C32.7169 35.2756 30.6267 35.2756 29.3473 33.9963L22.5 27.149L15.6527 33.9963C15.016 34.6329 14.1691 34.9573 13.3282 34.9573C12.4873 34.9573 11.6404 34.639 11.0037 33.9963C9.72437 32.7169 9.72437 30.6267 11.0037 29.3473L17.851 22.5L11.0037 15.6527C10.3671 15.016 10.0427 14.1691 10.0427 13.3282C10.0427 12.4873 10.3611 11.6464 11.0037 11.0037C12.2831 9.72437 14.3733 9.72437 15.6527 11.0037L22.5 17.851L29.3473 11.0037C29.984 10.3671 30.8309 10.0427 31.6718 10.0427C32.5127 10.0427 33.3596 10.3611 33.9963 11.0037C35.2756 12.2831 35.2756 14.3733 33.9963 15.6527L27.149 22.5L33.9963 29.3473Z"
                  fill="#1A1A1A"
                />
              </svg>
            </button>
          </div>
          <h3>Connect Your Wallet</h3>
          <div className="text-center wallet__btns">
            <button onClick={connectWallet}>
              <img src={Metamask} alt={"Metamask"} />
              <span>Metamask</span>
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Navbar className="navbar__custom" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Home
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {!isMobile &&
                <Col>
                  {accountId ? (
                    <button className="connect__wallet_btn ms-3">
                      {`${
                        accountId.substring(1, 6) +
                        "..." +
                        accountId.substring(accountId.length - 4)
                      }`}
                    </button>
                  ) : (
                    
                    <button
                      className="connect__wallet_btn ms-3"
                      onClick={handleShow}
                    >
                      Connect My Wallet
                    </button>
                  )}
                </Col>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Fragment>
  );
};

export default Navigation;
