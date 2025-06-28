package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.security.Timestamp;
import java.time.LocalDate;

@Entity
@Table(name = "car_bookings")
@Data
@Setter
@Getter
public class CarBookings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private int userId;
    private int carId;

    private LocalDate startDate;
    private LocalDate endDate;

    private Timestamp createdAt;

}

