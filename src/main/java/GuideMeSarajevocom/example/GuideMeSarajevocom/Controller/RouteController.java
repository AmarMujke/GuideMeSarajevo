package GuideMeSarajevocom.example.GuideMeSarajevocom.Controller;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Route;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @GetMapping
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Route> getRouteById(@PathVariable Long id) {
        Route route = routeService.getRouteById(id);
        return route != null ? ResponseEntity.ok(route) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Route> createRoute(@RequestBody Route route) {
        return ResponseEntity.ok(routeService.createRoute(route));
    }
}

