package com.khushal.service;

import com.khushal.exception.UserException;
import com.khushal.model.User;

import java.util.List;

public interface UserService {
	User createUser(User user);

	User getUserById(Long id) throws UserException;

	List<User> getAllUsers();

	void deleteUser(Long id) throws UserException;

	User updateUser(Long id, User user) throws UserException;

	User getUserFromJwt(String jwt) throws Exception;

	List<User> getUsersByIds(List<Long> ids);
}
