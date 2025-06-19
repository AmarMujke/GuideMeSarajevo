package GuideMeSarajevocom.example.GuideMeSarajevocom.car;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Car;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.CarRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class CarRepositoryTest {

    @Autowired
    private CarRepository carRepository;

    @Test
    public void testFindAllCars() {
        List<Car> cars = carRepository.findAll();
        assertNotNull(cars);
        assertFalse(cars.isEmpty());
    }

    @Test
    public void testFindById() {
        Car car = carRepository.findById(1L).orElse(null);
        assertNotNull(car);
    }
}
