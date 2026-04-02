package com.springboot.SimplyFly.config;

import com.springboot.SimplyFly.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@AllArgsConstructor

public class SecurityConfig {


    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain simplyflyFilterChain(HttpSecurity http) throws Exception{
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())

                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers(HttpMethod.OPTIONS,"/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/auth/login")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/auth/signup")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/search/routes")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/search/flights")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/search/flights/{routeId}")
                        .permitAll()

                        .requestMatchers(HttpMethod.GET,"/api/search/seats/{flightId}")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/search/filter")
                        .authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/booking/seats")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/booking/confirm")
                        .authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/booking/cancel")
                        .authenticated()


                );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        http.httpBasic(Customizer.withDefaults());
        return http.build();
    }







    //@Bean
   // public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        //return config.getAuthenticationManager();
    //}

}
