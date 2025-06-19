package GuideMeSarajevocom.example.GuideMeSarajevocom.route;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Route;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.RouteRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class RouteRepositoryTest {

    @Autowired
    private RouteRepository routeRepository;

    @Test
    public void testFindAllRoutes() {
        List<Route> routes = routeRepository.findAll();
        assertNotNull(routes);
        assertFalse(routes.isEmpty());
    }
}