package GuideMeSarajevocom.example.GuideMeSarajevocom;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityConfigIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "amar", password = "pass1", roles = {"USER"})
    public void testProtectedResourceAccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/secured"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
}
