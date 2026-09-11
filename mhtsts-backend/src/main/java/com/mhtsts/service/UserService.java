package com.mhtsts.service;

import com.mhtsts.entity.User;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User updateUser(Long id, User userDetails) {
        User existingUser = getUserById(id);
        existingUser.setUsername(userDetails.getUsername());
        existingUser.setFirstName(userDetails.getFirstName());
        existingUser.setLastName(userDetails.getLastName());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setRole(userDetails.getRole());
        existingUser.setLicenseNumber(userDetails.getLicenseNumber());
        existingUser.setLicenseType(userDetails.getLicenseType());
        existingUser.setLicenseState(userDetails.getLicenseState());
        existingUser.setLicenseExpiry(userDetails.getLicenseExpiry());
        existingUser.setIsActive(userDetails.getIsActive());
        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        User existingUser = getUserById(id);
        userRepository.delete(existingUser);
    }
}
