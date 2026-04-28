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
                        .authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/auth/passenger/signup")
                        .permitAll()
//                        .requestMatchers(HttpMethod.GET,"/api/search/routes")
//                        .permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/search/flights/v2")
                        .permitAll()
//                        .requestMatchers(HttpMethod.GET,"/api/search/flights/{routeId}")
//                        .permitAll()

                        .requestMatchers(HttpMethod.GET,"/api/search/seats/{flightId}")
                        .hasAuthority("PASSENGER")
                        .requestMatchers(HttpMethod.GET,"/api/search/filter")
                        .authenticated()
//                        .requestMatchers(HttpMethod.POST,"/api/booking/seats")
//                        .permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/booking/create")
                                .authenticated()
//                        .requestMatchers(HttpMethod.POST,"/api/booking/cancel")
//                        .authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/cancellations/request")
                         .hasAuthority("PASSENGER")
                         .requestMatchers(HttpMethod.GET,"/api/auth/userdetails")
                         .permitAll()
                                .requestMatchers(HttpMethod.GET,"/api/booking/get-all")
                                .hasAnyAuthority("ADMIN","FLIGHT_OWNER")
                                .requestMatchers(HttpMethod.GET,"/api/passenger/get-all")
                                .hasAnyAuthority("ADMIN","FLIGHT_OWNER")
                                .requestMatchers(HttpMethod.GET,"/api/seats/{flightId}")
                                .authenticated()
                                .requestMatchers(HttpMethod.GET,"/api/booking/passenger")
                                .hasAuthority("PASSENGER")
                                .requestMatchers(HttpMethod.GET,"/api/cancellations/owner/pending")
                                .hasAnyAuthority("FLIGHT_OWNER","ADMIN")
                                .requestMatchers(HttpMethod.PUT,"/api/cancellations/owner/{id}/reject")
                                .hasAuthority("FLIGHT_OWNER")
                                .requestMatchers(HttpMethod.PUT,"/api/cancellations/owner/{id}/approve")
                                .hasAuthority("FLIGHT_OWNER")
                                .requestMatchers(HttpMethod.GET,"/api/search/owner/flights")
                                .hasAuthority("FLIGHT_OWNER")
                                .requestMatchers(HttpMethod.PUT,"/api/search/owner/flights/{flightId}/route")
                                .hasAuthority("FLIGHT_OWNER")
                                .requestMatchers(HttpMethod.GET,"/api/cancellations/owner/all")
                                .hasAuthority("FLIGHT_OWNER")
                                .requestMatchers(HttpMethod.GET,"/api/booking/dashboard/stats")
                                .hasAuthority("FLIGHT_OWNER")
                                .requestMatchers(HttpMethod.GET,"/api/passenger/owner/get-all")
                                .hasAuthority("FLIGHT_OWNER")
                                .requestMatchers(HttpMethod.GET,"/api/passenger/{passengerId}")
                                .hasAuthority("FLIGHT_OWNER")
                                .requestMatchers(HttpMethod.GET,"/api/airport/get-all")
                                .authenticated()
                                .requestMatchers(HttpMethod.POST,"/api/airport/admin/create")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.PUT,"/api/airport/admin/update/{id}")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.DELETE,"/api/airport/admin/delete/{id}")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET,"/api/admin/routes/get-all")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.POST,"/api/admin/routes/create")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.PUT,"/api/admin/routes/update/{id}")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.DELETE,"/api/admin/routes/delete/{id}")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET,"/api/admin/flights/get-all")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.PUT,"/api/admin/flights/update/{id}")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.POST,"/api/admin/flights/create")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.DELETE,"/api/admin/flights/delete/{id}")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET,"/api/admin/users/get-all")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET,"/api/admin/users/role/{role}")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.PUT,"/api/admin/users/toggle/{id}")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET,"/api/admin/cancellations/get-all")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET,"/api/admin/cancellations/status/{status}")
                                .hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET,"/api/admin/dashboard/stats")
                                .hasAuthority("ADMIN")



                        .anyRequest().permitAll()


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
