import { useEffect, useState } from "react";
import Nav from "./nav";
import Footer from "./footer";
import "./transport.css";

const Transport = () => {
  const [cars, setCars] = useState([]);
  const [bookingStates, setBookingStates] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((err) => console.error("Failed to fetch cars", err));
  }, []);

  const toggleBookingForm = (carId) => {
    setBookingStates((prev) => ({
      ...prev,
      [carId]: !prev[carId],
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

  const handleBooking = (carId) => {
    const { startDate, endDate } = bookingStates[carId] || {};
    if (!startDate || !endDate) return;

    fetch("/api/car-bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: parseInt(userId),
        carId,
        startDate,
        endDate,
      }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Booking successful!");
          setBookingStates((prev) => ({ ...prev, [carId]: false }));
        } else {
          alert("Booking failed.");
        }
      })
      .catch((err) => console.error("Booking error", err));
  };

  return (
    <>
      <Nav />
      <div className="transport-container">
        <h2 className="transport-title">Available Cars for Rent</h2>
        <div className="car-grid">
          {cars.map((car) => (
            <div className="car-card" key={car.carId}>
              <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="car-image" />
              <div className="car-info">
                <h3>{car.brand} {car.model}</h3>
                <p>{car.description}</p>
                <p className="car-year">Year: {car.year}</p>
                <p className="car-price">${car.pricePerDay} / day</p>

                <button
                  className="book-button"
                  onClick={() => toggleBookingForm(car.carId)}
                >
                  {bookingStates[car.carId] ? "Cancel" : "Book Now"}
                </button>

                {bookingStates[car.carId] && (
                  <div className="booking-form">
                    <input
                      type="date"
                      value={bookingStates[car.carId]?.startDate || ""}
                      onChange={(e) => handleInputChange(car.carId, "startDate", e.target.value)}
                    />
                    <input
                      type="date"
                      value={bookingStates[car.carId]?.endDate || ""}
                      onChange={(e) => handleInputChange(car.carId, "endDate", e.target.value)}
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
      </div>
      <Footer />
    </>
  );
};

export default Transport;
