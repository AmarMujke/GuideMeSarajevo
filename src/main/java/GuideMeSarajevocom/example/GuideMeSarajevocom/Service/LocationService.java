package GuideMeSarajevocom.example.GuideMeSarajevocom.Service;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Location;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

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

    public void addLocation(Location location) {
        locationRepository.save(location);
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
}
