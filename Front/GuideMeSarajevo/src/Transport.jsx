import { useEffect, useState } from "react";
import "./transport.css";
import Nav from "./nav";
import Footer from "./footer";

const Transport = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("/api/rent-a-car/public")
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((err) => console.error("Error fetching cars:", err));
  }, []);

  const handleBook = (carId) => {
    // samo ako je user logovan
    fetch(`/api/rent-a-car/${carId}/book`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => alert("Car booked!"))
      .catch((err) => console.error("Error booking car:", err));
  };

  return (
    <>
        <Nav />
    <div className="transport-container">
      <h2 className="transport-title">Rent a Car</h2>
      <div className="cars-grid">
        {cars.map((car) => (
          <div className="car-card" key={car.id}>
            <img src={car.imageUrl} alt={car.name} className="car-image" />
            <div className="car-info">
              <h3>{car.name}</h3>
              <p>{car.description}</p>
              <p className="car-price">${car.pricePerDay} / day</p>
              <button onClick={() => handleBook(car.id)}>Book Now</button>
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
