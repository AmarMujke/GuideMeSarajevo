package GuideMeSarajevocom.example.GuideMeSarajevocom.Controller;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import javax.servlet.http.HttpServletRequest;
import java.net.URI;

@CrossOrigin("http://localhost:")
@RestController
@RequestMapping("/")
public class AuthController {

    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public String login() {
        return "login"; // Return the login page template name
    }

    @GetMapping("/")
    public String home() {
        return "home"; // Return the login page template name
    }

    @GetMapping("/oauth2/callback/google")
    public String googleCallback(OAuth2AuthenticationToken authenticationToken) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Extract user details from the authentication token
        String email = (String) authenticationToken.getPrincipal().getAttributes().get("email");
        String name = (String) authenticationToken.getPrincipal().getAttributes().get("name");

        // Check if the user exists in the database
        User user = userService.findByEmail(email);
        if (user == null) {
            // If the user doesn't exist, create a new user account
            user = new User();
            user.setEmail(email);
            user.setUsername(name);
            // Add additional user details as needed
            userService.save(user);
        }

        // Set the user's authentication details and redirect to the home page
        authentication.setAuthenticated(true);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return "redirect:/"; // Redirect to the home page
    }


//    @CrossOrigin(origins = "http://localhost:5173")
//    @GetMapping("/oauth2/authorize/google")
//    public String redirectToGoogleOAuth() {
//        // Your logic to redirect to Google OAuth authorization URL
//        return "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=988969390819-o5bvuie1ur5diplalc0gpvijola021n9.apps.googleusercontent.com&scope=openid%20email%20profile&redirect_uri=http://localhost:8080/oauth2/callback/google";
//    }
@CrossOrigin(origins = "http://localhost:5173")
@GetMapping("/oauth2/authorize/google")
public String redirectToGoogleOAuth() {
    // Your logic to redirect to Google OAuth authorization URL
    String clientId = "988969390819-o5bvuie1ur5diplalc0gpvijola021n9.apps.googleusercontent.com";
    String redirectUri = "http://localhost:8080/oauth2/callback/google";
    String scope = "openid email profile";
    String responseType = "code";
    return String.format("https://accounts.google.com/o/oauth2/v2/auth?response_type=%s&client_id=%s&scope=%s&redirect_uri=%s",
            responseType, clientId, scope, redirectUri);
}

}