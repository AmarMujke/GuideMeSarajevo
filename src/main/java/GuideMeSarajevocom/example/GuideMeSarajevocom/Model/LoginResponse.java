package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private String email;

    public LoginResponse(String token, String email) {
        this.token = token;
        this.email = email;
    }
}
