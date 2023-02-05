import { Col, Container, Row, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { useLoginUserMutation } from "../services/appApi";
import { AppContext } from "../context/appContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { socket } = useContext(AppContext);
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  function handleLogin(e) {
    e.preventDefault();
    // login user
    loginUser({ email, password }).then(({ data }) => {
      if (data) {
        // socket
        socket.emit("new-user");
        //navigate to the chat
        // console.log(data);
        navigate("/chat");
      }
    });
  }

  return (
    <Container>
      <Row>
        <Col className="login__bg" md={5}></Col>
        <Col
          md={7}
          className="d-flex flex-direction-column align-items-center justify-content-center "
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {error && <p className="alert alert-danger">{error.data}</p>}
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {isLoading ? <Spinner animation="grow" /> : "Login"}
            </Button>

            <div className="py-4">
              <p className="text-center">
                Don't have an account ?{" "}
                <Link style={{ textDecoration: "none" }} to={"/signup"}>
                  Signup
                </Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
export default Login;
