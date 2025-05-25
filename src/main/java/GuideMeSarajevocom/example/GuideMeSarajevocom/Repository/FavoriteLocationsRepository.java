package GuideMeSarajevocom.example.GuideMeSarajevocom.Repository;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.FavoriteLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteLocationsRepository extends JpaRepository<FavoriteLocation, Long> {
    List<FavoriteLocation> findByUser_UserId(Long userId);

    Optional<FavoriteLocation> findByUser_UserIdAndLocation_LocationId(Long userId, Long locationId);

    void deleteByUser_UserIdAndLocation_LocationId(Long userId, Long locationId);

}

