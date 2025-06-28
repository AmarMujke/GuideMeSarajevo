package GuideMeSarajevocom.example.GuideMeSarajevocom.Controller;

import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.LikedRouteDTO;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.LikedRoute;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Route;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.RouteRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.LikedRouteService;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/liked-routes")
public class LikedRouteController {

    @Autowired
    private LikedRouteService likedRouteService;

    @Autowired
    private RouteRepository routeRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LikedRouteDTO>> getUserLikes(@PathVariable Integer userId) {
        List<LikedRoute> likedRoutes = likedRouteService.getLikesByUser(userId);
        List<LikedRouteDTO> likedRouteDTOs = likedRoutes.stream().map(liked -> {
            Route route = routeRepository.findById((long) liked.getRouteId())
                    .orElseThrow(() -> new RuntimeException("Route not found"));
            LikedRouteDTO dto = new LikedRouteDTO();
            dto.setRouteId(liked.getRouteId());
            dto.setName(route.getName());
            dto.setDescription(route.getDescription());
            dto.setPrice(route.getPrice());
            dto.setImageUrl(route.getImageUrl());
            dto.setItinerary(route.getItinerary());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(likedRouteDTOs);
    }

    @PostMapping("/toggle")
    public ResponseEntity<String> toggleLike(@RequestBody Map<String, Integer> payload) {
        Integer userId = payload.get("userId");
        Integer routeId = payload.get("routeId");
        boolean liked = likedRouteService.toggleLike(userId, routeId);
        return ResponseEntity.ok(liked ? "Liked" : "Unliked");
    }
}

