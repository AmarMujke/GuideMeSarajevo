package GuideMeSarajevocom.example.GuideMeSarajevocom.ServiceImpl;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.UserRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository; // Assuming you have a UserRepository to interact with the database

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public void save(User user) {
        userRepository.save(user);
    }
}

