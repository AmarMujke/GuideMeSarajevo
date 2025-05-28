package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.security.Timestamp;
import java.time.LocalDate;

@Entity
@Table(name = "car_bookings")
@Data
public class CarBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private Integer userId;
    private Integer carId;

    private LocalDate startDate;
    private LocalDate endDate;

    private Timestamp createdAt;
}

