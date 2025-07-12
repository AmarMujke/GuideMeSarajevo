package GuideMeSarajevocom.example.GuideMeSarajevocom.Controller;

import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.CarBookingDTO;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Car;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.CarBookings;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.CarBookingRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.CarRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @Autowired
    private CarBookingRepository carBookingRepository;

    @Autowired
    private CarRepository carRepository;

    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        Optional<Car> car = carRepository.findById(id);
        return car.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Car> createCar(@RequestBody Car car) {
        return ResponseEntity.ok(carService.createCar(car));
    }

    @PostMapping("/book/{userId}/{carId}")
    public ResponseEntity<?> bookCar(
            @PathVariable int userId,
            @PathVariable int carId,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        try {
            CarBookings booking = new CarBookings();
            booking.setUserId(userId);
            booking.setCarId(carId);
            booking.setStartDate(LocalDate.parse(startDate));
            booking.setEndDate(LocalDate.parse(endDate));
            booking.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));

            carBookingRepository.save(booking);
            return ResponseEntity.ok("Car booked successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to book car: " + e.getMessage());
        }
    }

    @GetMapping("/bookings/{userId}")
    public ResponseEntity<List<CarBookingDTO>> getCarBookingsByUser(@PathVariable int userId) {
        List<CarBookings> bookings = carBookingRepository.findByUserId(userId);
        List<CarBookingDTO> bookingDTOs = bookings.stream().map(booking -> {
            Car car = carRepository.findById((long) booking.getCarId()).orElseThrow();
            CarBookingDTO dto = new CarBookingDTO();
            dto.setBookingId(Math.toIntExact(booking.getBookingId()));
            dto.setCarId(booking.getCarId());
            dto.setBrand(car.getBrand());
            dto.setModel(car.getModel());
            dto.setStartDate(booking.getStartDate());
            dto.setEndDate(booking.getEndDate());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(bookingDTOs);
    }

    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<?> cancelCarBooking(@PathVariable Long bookingId) {
        Optional<CarBookings> bookingOpt = carBookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            carBookingRepository.deleteById(bookingId);
            return ResponseEntity.ok("Booking cancelled.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found.");
        }
    }
}