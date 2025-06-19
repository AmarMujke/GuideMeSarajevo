package GuideMeSarajevocom.example.GuideMeSarajevocom.user;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUsername("mujke");
        user.setEmail("mujke@example.com");
        user.setPassword("password123");
        user.setRole("USER");

        entityManager.persistAndFlush(user);
    }

    @Test
    void testFindByEmail() {
        User found = userRepository.findByEmail("mujke@example.com");
        assertNotNull(found);
        assertEquals("mujke", found.getUsername());
    }

    @Test
    void testExistsByUsername() {
        boolean exists = userRepository.existsByUsername("mujke");
        assertTrue(exists);
    }

    @Test
    void testExistsByEmail() {
        boolean exists = userRepository.existsByEmail("mujke@example.com");
        assertTrue(exists);
    }

    @Test
    void testFindByUsername() {
        User found = userRepository.findByUsername("mujke");
        assertNotNull(found);
        assertEquals("mujke@example.com", found.getEmail());
    }

    @Test
    void testFindById() {
        Optional<User> found = userRepository.findById(user.getUserId());
        assertTrue(found.isPresent());
        assertEquals("mujke", found.get().getUsername());
    }

    @Test
    void testSaveUser() {
        User newUser = new User();
        newUser.setUsername("newbie");
        newUser.setEmail("newbie@example.com");
        newUser.setPassword("pass");
        newUser.setRole("USER");

        User saved = userRepository.save(newUser);

        assertNotNull(saved.getUserId());
        assertEquals("newbie", saved.getUsername());
    }

    @Test
    void testDeleteUser() {
        userRepository.deleteById(user.getUserId());
        Optional<User> deleted = userRepository.findById(user.getUserId());
        assertFalse(deleted.isPresent());
    }
}
