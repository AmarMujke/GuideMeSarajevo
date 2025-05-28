package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "routes")
@Data
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long routeId;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String itinerary;

    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private Integer createdBy;
    private Timestamp createdAt;
}

