package GuideMeSarajevocom.example.GuideMeSarajevocom.Controller;

import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.CategoryDTO;
import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.LocationDTO;
import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.UserDTO;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.FavoriteLocation;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Location;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.FavoriteLocationsRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.LocationRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteLocationController {

    @Autowired
    private FavoriteLocationsRepository favoriteLocationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    // Get favorite locations of a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<LocationDTO>> getFavoriteLocations(@PathVariable Long userId) {
        List<FavoriteLocation> favorites = favoriteLocationRepository.findByUser_UserId(userId);

        List<LocationDTO> locationDTOs = favorites.stream().map(fav -> {
            Location location = fav.getLocation();

            // Convert User to UserDTO
            UserDTO userDTO = new UserDTO(
                    location.getCreatedBy().getUserId(),
                    location.getCreatedBy().getUsername()
            );

            // Convert Categories to CategoryDTOs
            List<CategoryDTO> categoryDTOs = location.getCategories().stream().map(cat ->
                    new CategoryDTO(cat.getCategoryId(), cat.getName())
            ).collect(Collectors.toList());

            // Build LocationDTO
            LocationDTO dto = new LocationDTO();
            dto.setLocationId(location.getLocationId());
            dto.setName(location.getName());
            dto.setDescription(location.getDescription());
            dto.setLatitude(location.getLatitude());
            dto.setLongitude(location.getLongitude());
            dto.setImageUrl(location.getImageUrl());
            dto.setCreatedBy(userDTO);
            dto.setCategories(categoryDTOs);

            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(locationDTOs);
    }

    // Add favorite
    @PostMapping("/{userId}/{locationId}")
    public ResponseEntity<?> addFavorite(
            @PathVariable Long userId,
            @PathVariable Long locationId) {

        // Check if already exists
        Optional<FavoriteLocation> existing = favoriteLocationRepository.findByUser_UserIdAndLocation_LocationId(userId, locationId);
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Already favorited");
        }

        User user = userRepository.findById(userId).orElseThrow();
        Location location = locationRepository.findById(Math.toIntExact(locationId)).orElseThrow();

        FavoriteLocation favorite = new FavoriteLocation();
        favorite.setUser(user);
        favorite.setLocation(location);
        favoriteLocationRepository.save(favorite);

        return ResponseEntity.ok("Location added to favorites");
    }

    // Remove favorite
    @DeleteMapping("/{userId}/{locationId}")
    public ResponseEntity<?> removeFavorite(
            @PathVariable Long userId,
            @PathVariable Long locationId) {

        Optional<FavoriteLocation> favorite = favoriteLocationRepository.findByUser_UserIdAndLocation_LocationId(userId, locationId);
        if (favorite.isPresent()) {
            favoriteLocationRepository.delete(favorite.get());
            return ResponseEntity.ok("Location removed from favorites");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Favorite not found");
        }
    }
}

