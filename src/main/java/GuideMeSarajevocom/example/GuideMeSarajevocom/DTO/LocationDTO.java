package GuideMeSarajevocom.example.GuideMeSarajevocom.DTO;

import lombok.Data;

import java.util.List;

@Data
public class LocationDTO {
    private Long locationId;
    private String name;
    private String description;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
    private UserDTO createdBy;
    private List<CategoryDTO> categories;
}
