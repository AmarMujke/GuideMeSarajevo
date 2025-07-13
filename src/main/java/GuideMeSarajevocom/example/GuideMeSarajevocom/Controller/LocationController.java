package GuideMeSarajevocom.example.GuideMeSarajevocom.Controller;

import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.LocationDTO;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Location;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.FavoriteLocationsRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.UserRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.ImageUploadService;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.LocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;
    private final ImageUploadService imageUploadService;
    private final FavoriteLocationsRepository favoriteLocationsRepository;
    private UserRepository userRepository;

    public LocationController(LocationService locationService, ImageUploadService imageUploadService, FavoriteLocationsRepository favoriteLocationsRepository) {
        this.locationService = locationService;
        this.imageUploadService = imageUploadService;
        this.favoriteLocationsRepository = favoriteLocationsRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllLocations() {
        try {
            return ResponseEntity.ok(locationService.getAllLocations().stream()
                    .map(locationService::mapToLocationDTO)
                    .collect(Collectors.toList()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No locations found");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLocationById(@PathVariable int id) {
        try {
            return ResponseEntity.ok(locationService.getLocationById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Location not found with ID: " + id);
        }
    }

    @PostMapping
    public ResponseEntity<String> addLocation(@RequestBody Location location) {
        try {
            locationService.addLocation(location);
            return ResponseEntity.status(HttpStatus.CREATED).body("Location added successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error while adding location: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateLocation(@PathVariable int id, @RequestBody Location location) {
        try {
            locationService.updateLocation(id, location);
            return ResponseEntity.ok("Location updated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error while updating location: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLocation(@PathVariable int id) {
        try {
            locationService.deleteLocation(id);
            return ResponseEntity.ok("Location deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error while deleting location: " + e.getMessage());
        }

    }

    @GetMapping("/filter")
    public ResponseEntity<?> getLocationsByCategory(@RequestParam int categoryId) {
        try {
            return ResponseEntity.ok(locationService.getLocationsByCategoryId(categoryId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error fetching location by category: " + e.getMessage());
        }
    }

    @PostMapping("/with-image")
    public ResponseEntity<String> addLocationWithImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude
    ) {
        try {
            String imageUrl = imageUploadService.uploadImage(file);

            Location location = new Location();
            location.setName(name);
            location.setDescription(description);
            location.setLatitude(latitude);
            location.setLongitude(longitude);
            location.setImageUrl(imageUrl);

            locationService.addLocation(location);
            return ResponseEntity.status(HttpStatus.CREATED).body("Location created successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getLocationsByCategory(@PathVariable Long categoryId) {
        try {
            return ResponseEntity.ok(locationService.getLocationsByCategory(categoryId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No locations found");
        }
    }

    @GetMapping("/public/category/{categoryId}")
    public ResponseEntity<?> getPublicLocationsByCategory(@PathVariable Long categoryId) {
        try {
            return ResponseEntity.ok(locationService.getLocationsByCategory(categoryId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No locations found");
        }
    }

    @GetMapping("/my-locations")
    public ResponseEntity<?> getLocationsByCreator(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        String email = authentication.getName();
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admin role required");
            }
            List<LocationDTO> locations = locationService.getLocationsByCreatorId(user.getUserId())
                    .stream()
                    .map(locationService::mapToLocationDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(locations);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No locations found for user");
        }
    }
}
