package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import java.security.Timestamp;

@Entity
@Table(name = "booked_routes")
@IdClass(BookedRouteId.class)
public class BookedRoute {
    @Id
    private Integer userId;

    @Id
    private Integer routeId;

    private Timestamp bookedAt;
}

