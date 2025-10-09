package com.managementappbackend.service.domain.impl;

import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.Role;
import com.managementappbackend.model.exceptions.*;
import com.managementappbackend.repository.UserRepository;
import com.managementappbackend.service.domain.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(String username, String password, String repeatPassword, String name, String surname, Role role) {
        if (username == null || username.isEmpty() || password == null || password.isEmpty())
            throw new InvalidUsernameOrPasswordException("Invalid username or password");

        if (!password.equals(repeatPassword)) throw new PasswordsDoNotMatchException("Passwords do not match");

        if (userRepository.findByUsername(username).isPresent())
            throw new UsernameAlreadyExistsException("Username " + username + " already exists");

        User user = new User(username, passwordEncoder.encode(password), name, surname, role);
        userRepository.save(user);
        return user;
    }

    @Override
    public User login(String username, String password) {
        if (username == null || username.isEmpty() || password == null || password.isEmpty())
            throw new InvalidArgumentsException("Username or password is empty");

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username " + username + " not found"));
        if(!passwordEncoder.matches(password, user.getPassword()))
            throw new InvalidUserCredentialsException("Password is not correct");

        return user;

    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public List<User> findByRole(Role role) {
        return userRepository.findByRole(role);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }

    @Override
    public List<User> findByOrganizationId(Long organizationId) {
        return userRepository.findByOrganizationId(organizationId);
    }
}
