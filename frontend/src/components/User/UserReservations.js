import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { getReservations, removeRes } from "../../store/reservations";

export default function UserReservations() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const sessionUser = useSelector((store) => store.session.user);
  const reservations = useSelector((store) => store.reservationReducer);
  const resArray = Object.values(reservations);

  useEffect(() => {
    if (sessionUser?.id !== userId) {
      history.push(`/users/${sessionUser?.id}/reservations`);
    }
  }, [sessionUser, history, userId]);

  useEffect(() => {
    dispatch(getReservations(sessionUser?.id));
  }, [dispatch, sessionUser]);

  const date = (resTime) => new Date(resTime).toLocaleDateString("en-US");
  const time = (resTime) =>
    new Date(resTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <h1>{sessionUser?.firstName}'s Reservations:</h1>
      {resArray?.map((res) => (
        <div key={res?.id}>
          <ul>
            <li>{res?.User?.username}</li>
            <li>{res?.Restaurant?.title}</li>
            <li>{date(res?.time)}</li>
            <li>{time(res?.time)}</li>
            <li>{res?.numPpl}</li>
            <li>{res?.specialReq}</li>
          </ul>
          <button className="red-btn">
            <Link to={`/reservations/${res?.id}/edit`}>Modify</Link>
          </button>
          <button
            className="red-btn"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to cancel this reservation?"
                )
              ) {
                dispatch(removeRes(res));
                // history.push(`/users/${sessionUser?.id}/reservations`);
              }
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
}
