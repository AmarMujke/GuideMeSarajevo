package GuideMeSarajevocom.example.GuideMeSarajevocom.Service;

import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.CategoryDTO;
import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.LocationDTO;
import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.UserDTO;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Location;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.LocationRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    @Autowired
    private UserRepository userRepository;

    public void addLocation(Location location) {
        Long userId = location.getCreatedBy().getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        location.setCreatedBy(user);

        locationRepository.save(location);
    }

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location getLocationById(int id) {
        return locationRepository.findById(id).orElseThrow(() -> new RuntimeException("Location not found."));
    }

//    public void addLocation(Location location) {
//        locationRepository.save(location);
//    }

    public List<Location> getLocationsByCreatorId(Long userId) {
        return locationRepository.findByCreatedByUserId(userId);
    }

    public void updateLocation(int id, Location location) {
        Location existingLocation = getLocationById(id);
        existingLocation.setName(location.getName());
        existingLocation.setDescription(location.getDescription());
        existingLocation.setLatitude(location.getLatitude());
        existingLocation.setLongitude(location.getLongitude());
        locationRepository.save(existingLocation);
    }

    public void deleteLocation(int id) {
        locationRepository.deleteById(id);
    }

    public List<Location> getLocationsByCategoryId(int categoryId) {
        return locationRepository.findByCategoryId(categoryId);
    }

    public LocationDTO mapToLocationDTO(Location location) {
        LocationDTO dto = new LocationDTO();
        dto.setLocationId(location.getLocationId());
        dto.setName(location.getName());
        dto.setDescription(location.getDescription());
        dto.setLatitude(location.getLatitude());
        dto.setLongitude(location.getLongitude());
        dto.setImageUrl(location.getImageUrl());

        // map user
        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(location.getCreatedBy().getUserId());
        userDTO.setUsername(location.getCreatedBy().getUsername());
        userDTO.setEmail(location.getCreatedBy().getEmail());
        dto.setCreatedBy(userDTO);

        // map categories
        List<CategoryDTO> categoryDTOs = location.getCategories().stream().map(cat -> {
            CategoryDTO catDTO = new CategoryDTO();
            catDTO.setCategoryId(cat.getCategoryId());
            catDTO.setName(cat.getName());
            return catDTO;
        }).toList();

        dto.setCategories(categoryDTOs);

        return dto;
    }

    public List<LocationDTO> getLocationsByCategory(Long categoryId) {
        List<Location> locations = locationRepository.findByCategoryId(Math.toIntExact(categoryId));
        return locations.stream().map(LocationDTO::new).collect(Collectors.toList());
    }

}
