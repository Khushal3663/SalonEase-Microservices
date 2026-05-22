package com.khushal.service.impl;

import com.khushal.exception.UserException;
import com.khushal.model.User;
import com.khushal.payload.dto.KeycloakUserDTO;
import com.khushal.repository.UserRepository;
import com.khushal.service.KeycloakService;
import com.khushal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final KeycloakService keycloakService;

	@Override
	public User createUser(User user) {
		// TODO Auto-generated method stub
		return userRepository.save(user);
	}

	@Override
	public User getUserById(Long id) throws UserException {
		// TODO Auto-generated method stub
		Optional<User> otp = userRepository.findById(id);
		if (otp.isPresent()) {
			return otp.get();
		}
		throw new UserException("User not found");
	}

	@Override
	public List<User> getAllUsers() {
		// TODO Auto-generated method stub
		return userRepository.findAll();
	}

	@Override
	public void deleteUser(Long id) throws UserException {
		// TODO Auto-generated method stub
		Optional<User> opt = userRepository.findById(id);
		if (opt.isEmpty()) {
			throw new UserException("User not found with id " + id);
		}
		userRepository.deleteById(id);

	}

	@Override
	public User updateUser(Long id, User user) throws UserException {
		// TODO Auto-generated method stub
		Optional<User> otp = userRepository.findById(id);
		if (otp.isEmpty()) {
			throw new UserException("user not found with id " + id);
		}

		User existingUser = otp.get();

		existingUser.setFullName(user.getFullName());
		existingUser.setEmail(user.getEmail());
		existingUser.setUsername(user.getUsername());
		existingUser.setPhone(user.getPhone());
		existingUser.setRole(user.getRole());

		return userRepository.save(existingUser);
	}

	@Override
	public User getUserFromJwt(String jwt) throws Exception {
		KeycloakUserDTO keycloakUserDTO  = keycloakService.fetchUserProfileByJwt(jwt);
		System.out.println("Keycloak email: " + keycloakUserDTO.getEmail());
		User user = userRepository.findByEmail(keycloakUserDTO.getEmail());
		if(user == null){
			throw new Exception("User not found in database");
		}
        return user;
	}

	@Override
	public List<User> getUsersByIds(List<Long> ids) {
		return userRepository.findAllById(ids);
	}


}
