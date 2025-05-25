package GuideMeSarajevocom.example.GuideMeSarajevocom.Mapper;

import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.*;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Location;

import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserDTO toUserWithID(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(user.getEmail());
        userDTO.setUserId(user.getUserId());
        userDTO.setUsername(user.getUsername());
        return userDTO;
    }

    public static UserWithLocationsDTO toUserWithLocationsDTO(User user) {
        UserWithLocationsDTO dto = new UserWithLocationsDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setEmail(user.getEmail());

        List<LocationDTO> locations = user.getLocations().stream()
                .map(UserMapper::toLocationDTO)
                .collect(Collectors.toList());

        dto.setLocations(locations);
        return dto;
    }

    public static LocationDTO toLocationDTO(Location location) {
        LocationDTO dto = new LocationDTO();
        dto.setLocationId(location.getLocationId());
        dto.setName(location.getName());
        dto.setDescription(location.getDescription());
        dto.setLatitude(location.getLatitude());
        dto.setLongitude(location.getLongitude());
        dto.setImageUrl(location.getImageUrl());

        // createdBy
        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(location.getCreatedBy().getUserId());
        userDTO.setUsername(location.getCreatedBy().getUsername());
        userDTO.setEmail(location.getCreatedBy().getEmail());
        dto.setCreatedBy(userDTO);

        // 🧩 map categories
        if (location.getCategories() != null) {
            dto.setCategories(
                    location.getCategories()
                            .stream()
                            .map(category -> {
                                CategoryDTO categoryDTO = new CategoryDTO();
                                categoryDTO.setCategoryId((category.getCategoryId()));
                                categoryDTO.setName(category.getName());
                                return categoryDTO;
                            })
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}
