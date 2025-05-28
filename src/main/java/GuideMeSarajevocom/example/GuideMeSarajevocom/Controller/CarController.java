package GuideMeSarajevocom.example.GuideMeSarajevocom.Controller;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Car;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @PostMapping
    public ResponseEntity<Car> createCar(@RequestBody Car car) {
        return ResponseEntity.ok(carService.createCar(car));
    }
}

