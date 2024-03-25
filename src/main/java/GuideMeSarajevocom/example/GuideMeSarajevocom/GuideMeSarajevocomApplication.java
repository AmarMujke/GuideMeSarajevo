package GuideMeSarajevocom.example.GuideMeSarajevocom;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication(exclude = OAuth2ClientAutoConfiguration.class)
@ComponentScan(basePackages = {"GuideMeSarajevocom.example.GuideMeSarajevocom", "GuideMeSarajevocom.example.GuideMeSarajevocom.Config"})
public class GuideMeSarajevocomApplication {

	public static void main(String[] args) {
		SpringApplication.run(GuideMeSarajevocomApplication.class, args);
	}

}
