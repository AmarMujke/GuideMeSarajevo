package GuideMeSarajevocom.example.GuideMeSarajevocom.Service;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;

public interface UserService {
    User findByEmail(String email);
    void save(User user);
}

