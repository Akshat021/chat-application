import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <Row style={{ width: "100vw" }}>
      <Col
        md={6}
        className="d-flex flex-direction-column align-items-center justify-content-center "
      >
        <div>
          <h1>Share the word with your friends</h1>
          <p>Chat App lets you connect with the world</p>
          <Button as={Link} to="/chat" variant="success">
            Get Started
            <i className="fas fa-comments home-message-icon"></i>
          </Button>
        </div>
      </Col>

      <Col md={6} className="home_bg"></Col>
    </Row>
  );
};
export default Home;
