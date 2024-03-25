package GuideMeSarajevocom.example.GuideMeSarajevocom.Controller;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.User;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

    @Autowired
    private UserService userService; // Assuming you have a UserService to handle user-related operations

    @GetMapping("/login")
    public String login() {
        return "login"; // Return the login page template name
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
        return "redirect:/home"; // Redirect to the home page
    }

    @GetMapping("/home")
    public String home() {
        return "home"; // Return the home page template name
    }

}
