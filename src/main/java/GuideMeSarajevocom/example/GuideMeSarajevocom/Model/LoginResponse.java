package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private String email;
    private Long userId;

    public LoginResponse(String token, String email, Long userId) {
        this.token = token;
        this.email = email;
        this.userId = userId;
    }
}
