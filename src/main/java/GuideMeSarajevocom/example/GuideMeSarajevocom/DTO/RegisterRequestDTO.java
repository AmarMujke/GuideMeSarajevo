package GuideMeSarajevocom.example.GuideMeSarajevocom.DTO;

import lombok.Data;

@Data
public class RegisterRequestDTO {
    private String username;
    private String email;
    private String role;
    private String password;
}
