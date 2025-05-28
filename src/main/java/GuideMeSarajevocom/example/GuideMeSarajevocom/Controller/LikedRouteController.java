package GuideMeSarajevocom.example.GuideMeSarajevocom.Controller;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.LikedRoute;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.LikedRouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/liked-routes")
public class LikedRouteController {

    @Autowired
    private LikedRouteService likedRouteService;

    @GetMapping("/user/{userId}")
    public List<LikedRoute> getUserLikes(@PathVariable Integer userId) {
        return likedRouteService.getLikesByUser(userId);
    }

    @PostMapping("/toggle")
    public ResponseEntity<String> toggleLike(@RequestBody Map<String, Integer> payload) {
        Integer userId = payload.get("userId");
        Integer routeId = payload.get("routeId");
        boolean liked = likedRouteService.toggleLike(userId, routeId);
        return ResponseEntity.ok(liked ? "Liked" : "Unliked");
    }
}

