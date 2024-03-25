package GuideMeSarajevocom.example.GuideMeSarajevocom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}

