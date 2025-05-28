package GuideMeSarajevocom.example.GuideMeSarajevocom.Repository;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
}

