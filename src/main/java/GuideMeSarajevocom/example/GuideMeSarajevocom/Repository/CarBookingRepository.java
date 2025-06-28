package GuideMeSarajevocom.example.GuideMeSarajevocom.Repository;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.CarBooking;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.CarBookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarBookingRepository extends JpaRepository<CarBookings, Long> {
    List<CarBookings> findByUserId(int userId);
}
