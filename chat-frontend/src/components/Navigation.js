import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/chat-app-logo.png";
import { useSelector } from "react-redux";
import { useLogoutUserMutation } from "../services/appApi";

const Navigation = () => {
  const user = useSelector((state) => state.user);
  const [logoutUser] = useLogoutUserMutation();
  async function handleLogout(e) {
    e.preventDefault();
    await logoutUser(user);
    // redirect to home page | user won't be able to use the back button to navigate to it.
    window.location.replace("/");
  }
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="LOGO" width="40" height="40" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {!user && (
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              )}
              <LinkContainer to="/chat">
                <Nav.Link>Chat</Nav.Link>
              </LinkContainer>

              {user && (
                <NavDropdown
                  title={
                    <>
                      <img
                        src={user.picture}
                        style={{
                          width: 30,
                          height: 30,
                          marginRight: 10,
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                        alt=""
                      />
                      {user.name}
                    </>
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item>
                    <Button variant="danger" onClick={handleLogout}>
                      Logout
                    </Button>
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};
export default Navigation;
