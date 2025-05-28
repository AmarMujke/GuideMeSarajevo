package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequest {
    private String email;
    private String password;
    private Long userId;
}
