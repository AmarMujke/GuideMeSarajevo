package GuideMeSarajevocom.example.GuideMeSarajevocom.Repository;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.BookedRoute;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.BookedRouteId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookedRouteRepository extends JpaRepository<BookedRoute, BookedRouteId> {
    Optional<BookedRoute> findByUserIdAndRouteId(Integer userId, Integer routeId);
}
