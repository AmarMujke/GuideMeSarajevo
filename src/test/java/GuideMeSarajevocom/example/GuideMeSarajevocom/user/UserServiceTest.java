package GuideMeSarajevocom.example.GuideMeSarajevocom.user;

import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.RegisterRequestDTO;
import GuideMeSarajevocom.example.GuideMeSarajevocom.DTO.UserDTO;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.MyUserDetails;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.UserRepository;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setup() {
        user = new User();
        user.setUserId(1L);
        user.setUsername("mujke");
        user.setEmail("mujke@example.com");
        user.setPassword("encodedPass");
    }

    @Test
    void testFindAllUsersAsDTO() {
        List<User> users = List.of(user);
        when(userRepository.findAll()).thenReturn(users);

        List<UserDTO> result = userService.findAllUsersAsDTO();

        assertEquals(1, result.size());
        assertEquals("mujke", result.get(0).getUsername());
    }

    @Test
    void testFindUserDTOById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserDTO dto = userService.findUserDTOById(1L);

        assertEquals("mujke", dto.getUsername());
    }

    @Test
    void testFindUserDTOById_UserNotFound() {
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.findUserDTOById(2L));
    }

    @Test
    void testRegisterNewUser() {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("mujke");
        request.setEmail("mujke@example.com");
        request.setPassword("plainPass");
        request.setRole("USER");

        when(passwordEncoder.encode("plainPass")).thenReturn("encodedPass");

        userService.registerNewUser(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());

        User savedUser = captor.getValue();
        assertEquals("mujke", savedUser.getUsername());
        assertEquals("encodedPass", savedUser.getPassword());
        assertEquals("USER", savedUser.getRole());
    }

    @Test
    void testExistsByUsername() {
        when(userRepository.existsByUsername("mujke")).thenReturn(true);
        assertTrue(userService.existsByUsername("mujke"));
    }

    @Test
    void testExistsByEmail() {
        when(userRepository.existsByEmail("mujke@example.com")).thenReturn(true);
        assertTrue(userService.existsByEmail("mujke@example.com"));
    }

    @Test
    void testCheckPassword_Match() {
        UserDetails userDetails = new MyUserDetails(user);
        when(passwordEncoder.matches("test", "encodedPass")).thenReturn(true);

        assertTrue(userService.checkPassword(userDetails, "test"));
    }

    @Test
    void testCheckPassword_Mismatch() {
        UserDetails userDetails = new MyUserDetails(user);
        when(passwordEncoder.matches("wrong", "encodedPass")).thenReturn(false);

        assertFalse(userService.checkPassword(userDetails, "wrong"));
    }

    @Test
    void testLoadUserByEmail_NotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(null);

        assertThrows(UsernameNotFoundException.class, () ->
                userService.loadUserByEmail("missing@example.com"));
    }

    @Test
    void testSave_ShouldEncodePasswordAndSave() {
        User newUser = new User();
        newUser.setPassword("raw");

        when(passwordEncoder.encode("raw")).thenReturn("encoded");

        userService.save(newUser);

        assertEquals("encoded", newUser.getPassword());
        verify(userRepository).save(newUser);
    }
}
