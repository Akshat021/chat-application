import { useContext, useEffect } from "react";
import { ListGroup, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./Sidebar.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const {
    socket,
    rooms,
    setRooms,
    currentRoom,
    setCurrentRoom,
    members,
    setMembers,
    privateMemberMsg,
    setprivateMemberMsg,
  } = useContext(AppContext);

  function joinRoom(room, isPublic = true) {
    if (!user) return alert("Please Login");

    socket.emit("join-room", room, currentRoom);
    setCurrentRoom(room);

    if (isPublic) {
      setprivateMemberMsg(null);
    }
    // dispatch for notifications
    dispatch(resetNotifications(room));
  }

  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom !== room) dispatch(addNotifications(room));
  });

  function orderIds(id1, id2) {
    if (id1 > id2) {
      return id1 + "-" + id2;
    }
    return id2 + "-" + id1;
  }

  function handlePrivateMemberMsg(member) {
    setprivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }

  useEffect(() => {
    if (user) {
      setCurrentRoom("General");
      getRooms();
      socket.emit("join-room", "General");
      socket.emit("new-user");
    }
  }, []);

  socket.off("new-user").on("new-user", (payload) => {
    // console.log(payload);
    setMembers(payload);
  });

  function getRooms() {
    fetch("http://localhost:5000/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }

  if (!user) {
    return <></>;
  }

  return (
    <div>
      <h2>Available rooms</h2>
      <ListGroup>
        {rooms.map((room, idx) => {
          return (
            <ListGroup.Item
              onClick={() => joinRoom(room)}
              key={idx}
              active={room === currentRoom}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {room}{" "}
              {currentRoom !== room && (
                <span className="badge rounded-pill bg-primary">
                  {user.newMessages[room]}
                </span>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <h2>Members</h2>
      <ListGroup>
        {members.map((member) => (
          <ListGroup.Item
            key={member._id}
            style={{ cursor: "pointer" }}
            active={privateMemberMsg?._id === member?._id}
            onClick={() => handlePrivateMemberMsg(member)}
            disabled={member?._id === user?._id}
          >
            <Row>
              <Col xs={2} className="member-status">
                <img
                  src={member.picture}
                  alt=""
                  className="member-status-img"
                />
                {member.status === "online" ? (
                  <i className="fas fa-circle sidebar-online-status"></i>
                ) : (
                  <i className="fas fa-circle sidebar-offline-status"></i>
                )}
              </Col>
              <Col xs={9}>
                {member.name}
                {member._id === user?._id && " (You)"}
                {member.status === "offline" && " (offline)"}
              </Col>
              <Col xs={1}>
                <span className="badge rounded-pill bg-primary">
                  {user.newMessages[orderIds(member._id, user._id)]}
                </span>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};
export default Sidebar;
