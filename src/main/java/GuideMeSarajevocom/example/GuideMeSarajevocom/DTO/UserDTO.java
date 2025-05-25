package GuideMeSarajevocom.example.GuideMeSarajevocom.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long userId;
    private String username;
    private String email;

    public UserDTO(Long userId, String username) {
      this.userId = userId;
      this.username = username;
    }
}

