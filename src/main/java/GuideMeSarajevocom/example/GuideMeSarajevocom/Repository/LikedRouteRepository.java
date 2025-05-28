package GuideMeSarajevocom.example.GuideMeSarajevocom.Repository;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.LikedRoute;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.LikedRouteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikedRouteRepository extends JpaRepository<LikedRoute, LikedRouteId> {
    List<LikedRoute> findByUserId(Integer userId);
    boolean existsByUserIdAndRouteId(Integer userId, Integer routeId);
}
