package GuideMeSarajevocom.example.GuideMeSarajevocom.Controller;

import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.BookedRouteDTO;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.BookedRoute;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Route;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.BookedRouteRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.RouteRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.UserRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @Autowired
    private BookedRouteRepository bookedRouteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RouteRepository routeRepository;

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

    @PostMapping("/{userId}/{routeId}")
    public ResponseEntity<?> bookRoute(
            @PathVariable Long userId,
            @PathVariable Long routeId) {
        Optional<BookedRoute> existing = bookedRouteRepository.findByUserIdAndRouteId(
                Math.toIntExact(userId), Math.toIntExact(routeId)
        );
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Already booked");
        }
        User user = userRepository.findById(userId).orElseThrow();
        Route route = routeRepository.findById((long) routeId.intValue()).orElseThrow();
        BookedRoute bookedRoute = new BookedRoute();
        bookedRoute.setUserId(Math.toIntExact(user.getUserId()));
        bookedRoute.setRouteId(Math.toIntExact(route.getRouteId()));
        bookedRoute.setBookedAt(LocalDateTime.now());
        bookedRouteRepository.save(bookedRoute);
        return ResponseEntity.ok("Route booked successfully");
    }

    @GetMapping("/booked/{userId}")
    public ResponseEntity<List<BookedRouteDTO>> getBookedRoutesByUser(@PathVariable Long userId) {
        List<BookedRoute> bookings = bookedRouteRepository.findByUserId(Math.toIntExact(userId));
        List<BookedRouteDTO> bookedRouteDTOs = bookings.stream().map(booking -> {
            Route route = routeRepository.findById((long) booking.getRouteId()).orElseThrow();
            BookedRouteDTO dto = new BookedRouteDTO();
            dto.setRouteId(booking.getRouteId());
            dto.setName(route.getName());
            dto.setDescription(route.getDescription());
            dto.setPrice(route.getPrice());
            dto.setImageUrl(route.getImageUrl());
            dto.setItinerary(route.getItinerary());
            dto.setBookedAt(booking.getBookedAt());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(bookedRouteDTOs);
    }
}