package GuideMeSarajevocom.example.GuideMeSarajevocom.Controller;

import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.CarBookingDTO;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Car;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.CarBookings;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.CarBookingRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.CarRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.UserRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
            @PathVariable Long userId,
            @PathVariable Long carId,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        return ResponseEntity.ok("Car booked successfully.");
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
        return ResponseEntity.ok("Booking cancelled.");
    }
}