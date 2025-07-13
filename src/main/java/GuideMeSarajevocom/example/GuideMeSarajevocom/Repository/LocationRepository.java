package GuideMeSarajevocom.example.GuideMeSarajevocom.Repository;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {
    List<Location> findByNameContaining(String name);
    @Query("SELECT l FROM Location l JOIN l.categories c WHERE c.categoryId = :categoryId")
    List<Location> findByCategoryId(@Param("categoryId") int categoryId);
    List<Location> findByCreatedByUserId(Integer userId);
}