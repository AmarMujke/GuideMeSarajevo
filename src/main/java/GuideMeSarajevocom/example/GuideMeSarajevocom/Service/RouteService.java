package GuideMeSarajevocom.example.GuideMeSarajevocom.Service;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Route;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Route getRouteById(Long id) {
        return routeRepository.findById(id).orElse(null);
    }

    public Route createRoute(Route route) {
        route.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        return routeRepository.save(route);
    }
}
