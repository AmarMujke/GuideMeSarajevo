package GuideMeSarajevocom.example.GuideMeSarajevocom.Controller;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.BookedRoute;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Route;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.BookedRouteRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.RouteRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/booked-routes")
public class BookedRouteController {

    @Autowired
    private BookedRouteRepository bookedRouteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RouteRepository routeRepository;

    // Book a route
    @PostMapping("/{userId}/{routeId}")
    public ResponseEntity<?> bookRoute(
            @PathVariable Long userId,
            @PathVariable Long routeId) {

        Optional<BookedRoute> existing = bookedRouteRepository.findByUserIdAndRouteId(
                Math.toIntExact(userId), Math.toIntExact(routeId)
        );        if (existing.isPresent()) {
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

    // Optionally: cancel booking
    @DeleteMapping("/{userId}/{routeId}")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long userId,
            @PathVariable Long routeId) {

        Optional<BookedRoute> existing = bookedRouteRepository.findByUserIdAndRouteId(
                Math.toIntExact(userId), Math.toIntExact(routeId)
        );        if (existing.isPresent()) {
            bookedRouteRepository.delete(existing.get());
            return ResponseEntity.ok("Booking cancelled");
        } else {
            return ResponseEntity.badRequest().body("Booking not found");
        }
    }
}
