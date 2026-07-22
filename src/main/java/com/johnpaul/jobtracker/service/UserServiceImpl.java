package com.johnpaul.jobtracker.service;

import com.johnpaul.jobtracker.entity.User;
import com.johnpaul.jobtracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setRole("ROLE_USER");

        return userRepository.save(user);
    }
}
