package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@IdClass(LikedRouteId.class)
@Table(name = "liked_routes")
@Data
public class LikedRoute {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Id
    @Column(name = "route_id")
    private Integer routeId;

    @Column(name = "liked_at")
    private LocalDateTime likedAt;

    public LikedRoute() {}

    public LikedRoute(Integer userId, Integer routeId) {
        this.userId = userId;
        this.routeId = routeId;
        this.likedAt = LocalDateTime.now();
    }

    // Getteri i setteri
}

