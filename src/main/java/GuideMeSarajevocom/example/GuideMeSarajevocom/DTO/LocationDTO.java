package GuideMeSarajevocom.example.GuideMeSarajevocom.DTO;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Location;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationDTO {
    private Long locationId;
    private String name;
    private String description;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
    private UserDTO createdBy;
    private List<Long> categoryIds;
    private List<CategoryDTO> categories;

    public LocationDTO(Location location) {
        this.locationId = location.getLocationId();
        this.name = location.getName();
        this.description = location.getDescription();
        this.latitude = location.getLatitude();
        this.longitude = location.getLongitude();
        this.imageUrl = location.getImageUrl();
        this.categoryIds = location.getCategories().isEmpty()
                ? new ArrayList<>()
                : List.of(location.getCategories().getFirst().getCategoryId());
    }

}
