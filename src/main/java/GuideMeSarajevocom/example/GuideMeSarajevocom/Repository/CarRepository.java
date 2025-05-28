package GuideMeSarajevocom.example.GuideMeSarajevocom.Repository;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
}

