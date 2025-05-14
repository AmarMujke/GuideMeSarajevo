package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Setter
@Getter
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    private String name;

    @ManyToMany(mappedBy = "categories")
    @JsonIgnore
    private List<Location> locations;
}
