package GuideMeSarajevocom.example.GuideMeSarajevocom.location;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Location;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.LocationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class LocationRepositoryTest {

    @Autowired
    private LocationRepository locationRepository;

    @Test
    public void testFindAllLocations() {
        List<Location> locations = locationRepository.findAll();
        assertNotNull(locations);
        assertFalse(locations.isEmpty());
    }

    @Test
    public void testFindById() {
        Optional<Location> location = locationRepository.findById(1);
        assertTrue(location.isPresent());
        assertEquals("Baščaršija", location.get().getName());
    }
}
