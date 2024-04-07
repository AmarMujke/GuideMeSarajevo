package GuideMeSarajevocom.example.GuideMeSarajevocom.Service;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserService {
    User findByEmail(String email);
    void save(User user);

    User findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean checkPassword(UserDetails userDetails, String password);
}

