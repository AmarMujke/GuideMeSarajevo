package GuideMeSarajevocom.example.GuideMeSarajevocom.Service;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.LikedRoute;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.LikedRouteId;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.LikedRouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikedRouteService {

    @Autowired
    private LikedRouteRepository likedRouteRepository;

    public List<LikedRoute> getLikesByUser(Integer userId) {
        return likedRouteRepository.findByUserId(userId);
    }

    public boolean toggleLike(Integer userId, Integer routeId) {
        LikedRouteId id = new LikedRouteId(userId, routeId);
        if (likedRouteRepository.existsById(id)) {
            likedRouteRepository.deleteById(id);
            return false; // unliked
        } else {
            likedRouteRepository.save(new LikedRoute(userId, routeId));
            return true; // liked
        }
    }
}

