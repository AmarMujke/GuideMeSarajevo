package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long locationId;

    private String name;

    private String description;

    private Double latitude;

    private Double longitude;

    private String imageUrl;

    @ManyToMany
    @JoinTable(
            name = "location_categories",
            joinColumns = @JoinColumn(name = "location_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories;
}
