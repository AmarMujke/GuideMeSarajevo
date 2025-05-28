package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "car")
@Data
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long carId;

    private String brand;
    private String model;
    private Integer year;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal pricePerDay;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private Integer createdBy;
}


