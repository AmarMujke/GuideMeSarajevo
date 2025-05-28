package GuideMeSarajevocom.example.GuideMeSarajevocom.Service;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Car;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Car createCar(Car car) {
        return carRepository.save(car);
    }
}

