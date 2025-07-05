import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Nav from "./nav";
import Footer from "./footer";
import "./Transport.css";

const Transport = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [cars, setCars] = useState([]);
  const [bookingStates, setBookingStates] = useState({});
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!user?.email || userId) return;
      try {
        const res = await fetch(`/api/auth/by-email?email=${user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user ID");
        const data = await res.json();
        setUserId(data.userId);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchCars = async () => {
      try {
        const res = await fetch("/api/cars", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch cars");
        const data = await res.json();
        setCars(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserId();
    fetchCars();
  }, [user?.email, token, userId]);

  const toggleBookingForm = (carId) => {
    setBookingStates((prev) => ({
      ...prev,
      [carId]: prev[carId] ? null : { startDate: "", endDate: "" },
    }));
  };

  const handleInputChange = (carId, field, value) => {
    setBookingStates((prev) => ({
      ...prev,
      [carId]: {
        ...prev[carId],
        [field]: value,
      },
    }));
  };

  const handleBooking = async (carId) => {
    const { startDate, endDate } = bookingStates[carId] || {};
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }


    const today = new Date().toISOString().split("T")[0];
    if (startDate < today) {
      setError("Start date cannot be in the past.");
      return;
    }
    if (endDate < startDate) {
      setError("End date must be after start date.");
      return;
    }

    try {
      const res = await fetch(`/api/cars/book/${userId}/${carId}?startDate=${startDate}&endDate=${endDate}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Booking failed.");
      }
      alert("Booking successful!");
      setBookingStates((prev) => ({ ...prev, [carId]: null }));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Nav />
      <div className="transport-container">
        <h2 className="transport-title">Available Cars for Rent</h2>
        {error && <div className="error">{error}</div>}
        {!userId ? (
          <p>Please log in to book cars.</p>
        ) : cars.length === 0 ? (
          <p>No cars available at the moment.</p>
        ) : (
          <div className="car-grid">
            {cars.map((car) => (
              <div className="car-card" key={car.carId}>
                <img
                  src={car.imageUrl || "/placeholder-car.jpg"}
                  alt={`${car.brand} ${car.model}`}
                  className="car-image"
                />
                <div className="car-info">
                  <h3>{car.brand} {car.model}</h3>
                  <p>{car.description || "No description available."}</p>
                  <p className="car-year">Year: {car.year || "N/A"}</p>
                  <p className="car-price">${car.pricePerDay || "N/A"} / day</p>
                  <button
                    className="book-button"
                    onClick={() => toggleBookingForm(car.carId)}
                    disabled={!userId}
                  >
                    {bookingStates[car.carId] ? "Cancel" : "Book Now"}
                  </button>
                  {bookingStates[car.carId] && (
                    <div className="booking-form">
                      <input
                        type="date"
                        value={bookingStates[car.carId]?.startDate || ""}
                        onChange={(e) =>
                          handleInputChange(car.carId, "startDate", e.target.value)
                        }
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <input
                        type="date"
                        value={bookingStates[car.carId]?.endDate || ""}
                        onChange={(e) =>
                          handleInputChange(car.carId, "endDate", e.target.value)
                        }
                        min={bookingStates[car.carId]?.startDate || ""}
                      />
                      <button
                        className="confirm-booking-button"
                        onClick={() => handleBooking(car.carId)}
                      >
                        Confirm Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Transport;