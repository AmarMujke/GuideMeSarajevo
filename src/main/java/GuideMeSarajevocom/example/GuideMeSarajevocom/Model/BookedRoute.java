package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "booked_routes")
@Data
@IdClass(BookedRouteId.class)
public class BookedRoute {

    @Id
    private Integer userId;

    @Id
    private Integer routeId;

    private LocalDateTime bookedAt;
}

