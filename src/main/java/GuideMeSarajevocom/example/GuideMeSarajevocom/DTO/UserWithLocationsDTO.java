package GuideMeSarajevocom.example.GuideMeSarajevocom.DTO;

import lombok.Data;
import java.util.List;

@Data
public class UserWithLocationsDTO {
    private Long userId;
    private String username;
    private String email;
    private String role;
    private List<LocationDTO> locations;
}

