package GuideMeSarajevocom.example.GuideMeSarajevocom.Controller;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.LoginRequest;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.LoginResponse;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.JwtService;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserController(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken.");
        }

        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already registered.");
        }

        user.setPassword(user.getPassword());

        userService.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail().trim();
        String rawPassword = loginRequest.getPassword().trim();

        User user = userService.findByEmail(email);

        if (user == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }

        String token = jwtService.generateToken(email);
        return ResponseEntity.ok(new LoginResponse(token, email));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing or invalid Authorization header.");
            }

            String token = authHeader.substring(7); // Remove "Bearer "

            boolean isValid = jwtService.validateToken(token);

            if (isValid) {
                String email = jwtService.getEmailFromToken(token);
                return ResponseEntity.ok().body("Token is valid for email: " + email);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token validation failed.");
        }
    }
}
