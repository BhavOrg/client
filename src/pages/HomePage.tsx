import React from "react";
import Container from "../components/common/Container/Container";
import Navbar from "../components/common/Navbar/Navbar";

const Home: React.FC = () => {
  return (
    <>
      <Navbar />

      <section className="py-4 py-md-6">
        <Container>
          <div className="row">
            <div className="col-12 col-md-6 mb-4 mb-md-0">
              <h1 className="mb-3">Welcome to Bhav</h1>
              <p className="mb-4">
                An anonymous authentication system designed with privacy as a
                core principle.
              </p>
              <div className="d-flex gap-2 flex-column flex-sm-row">
                <a href="/register" className="btn btn-primary btn-full-sm">
                  Get Started
                </a>
                <a
                  href="/learn-more"
                  className="btn btn-outline-primary btn-full-sm"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="col-12 col-md-6 d-none d-md-block">
              <div className="bg-light p-4 rounded text-center">
                <p>Placeholder for illustration</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-4 py-md-6 bg-light">
        <Container>
          <h2 className="text-center mb-4">Key Features</h2>

          <div className="row">
            <div className="col-12 col-md-4 mb-4 mb-md-0">
              <div className="p-3 bg-white rounded h-100">
                <h3 className="mb-2">Complete Anonymity</h3>
                <p>
                  No personal identifiers required for account creation or
                  authentication.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4 mb-4 mb-md-0">
              <div className="p-3 bg-white rounded h-100">
                <h3 className="mb-2">Dual Authentication</h3>
                <p>
                  Password for familiar devices, passphrase for new device
                  logins.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-3 bg-white rounded h-100">
                <h3 className="mb-2">Secure Recovery</h3>
                <p>
                  12-word unique passphrase ensures account recovery without
                  personal data.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-4 py-md-6">
        <Container>
          <div className="row">
            <div className="col-12 col-md-6 order-md-2 mb-4 mb-md-0">
              <h2 className="mb-3">How It Works</h2>
              <p>
                Bhav's authentication system ensures your privacy while
                providing secure access to your account.
              </p>

              <ul className="mt-4">
                <li className="mb-2">
                  Create an account with just a username and password
                </li>
                <li className="mb-2">
                  Receive your unique 12-word recovery passphrase
                </li>
                <li className="mb-2">Use your password on familiar devices</li>
                <li className="mb-2">
                  Use your passphrase when accessing from new devices
                </li>
              </ul>
            </div>

            <div className="col-12 col-md-6 order-md-1">
              <div className="bg-light p-4 rounded text-center">
                <p>Placeholder for diagram</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <footer className="py-4 bg-dark text-light">
        <Container>
          <div className="row">
            <div className="col-12 col-md-4 mb-4 mb-md-0">
              <h4>Bhav</h4>
              <p>Privacy-focused authentication system</p>
            </div>

            <div className="col-6 col-md-2 mb-4 mb-md-0">
              <h5 className="mb-3">Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="/about">About</a>
                </li>
                <li className="mb-2">
                  <a href="/features">Features</a>
                </li>
                <li className="mb-2">
                  <a href="/docs">Documentation</a>
                </li>
              </ul>
            </div>

            <div className="col-6 col-md-2 mb-4 mb-md-0">
              <h5 className="mb-3">Support</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="/faq">FAQ</a>
                </li>
                <li className="mb-2">
                  <a href="/contact">Contact</a>
                </li>
                <li className="mb-2">
                  <a href="/community">Community</a>
                </li>
              </ul>
            </div>

            <div className="col-12 col-md-4">
              <h5 className="mb-3">Stay Connected</h5>
              <p>Subscribe to our newsletter for updates</p>
              <form className="mt-3">
                <div className="d-flex">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Your email"
                  />
                  <button type="submit" className="btn btn-primary ml-2">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-12">
              <p className="text-center mb-0">
                © 2025 Bhav. All rights reserved.
              </p>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
};

export default Home;
