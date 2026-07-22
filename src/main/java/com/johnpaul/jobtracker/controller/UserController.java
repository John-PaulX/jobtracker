package com.johnpaul.jobtracker.controller;

import com.johnpaul.jobtracker.entity.User;
import com.johnpaul.jobtracker.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.johnpaul.jobtracker.dto.LoginRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.johnpaul.jobtracker.security.JwtService;


@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserService userService;

    private final JwtService jwtService;
    public UserController(UserService userService,
                          AuthenticationManager authenticationManager,
                          JwtService jwtService) {

        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        User savedUser = userService.register(user);

        System.out.println("username = " + user.getUsername());
        System.out.println("email = " + user.getEmail());

        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }


    private final AuthenticationManager authenticationManager;


    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(

                        new UsernamePasswordAuthenticationToken(

                                request.getEmail(),
                                request.getPassword()

                        )

                );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(token);
    }
}
