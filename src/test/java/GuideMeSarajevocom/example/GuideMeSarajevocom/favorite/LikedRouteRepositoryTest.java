package GuideMeSarajevocom.example.GuideMeSarajevocom.favorite;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.LikedRoute;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.LikedRouteId;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.LikedRouteRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class LikedRouteRepositoryTest {

    @Autowired
    private LikedRouteRepository likedRouteRepository;

    @Test
    public void testSaveAndFindLikedRoute() {
        LikedRoute route = new LikedRoute();
        route.setUserId(1);
        route.setRouteId(1);
        likedRouteRepository.save(route);

        LikedRouteId id = new LikedRouteId(1, 1);
        boolean exists = likedRouteRepository.existsById(id);
        assertTrue(exists);
    }
}