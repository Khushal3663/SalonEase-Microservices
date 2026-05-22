package com.khushal.service;

import com.khushal.payload.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import static java.util.Arrays.copyOfRange;

@Service
@RequiredArgsConstructor
public class KeycloakService {
    private static final String KEYCLOAK_BASE_URL = "http://localhost:8080";
    private static final String KEYCLOAK_ADMIN_API_URL = KEYCLOAK_BASE_URL + "/admin/realms/myrealm/users";

    private static final String TOKEN_URL = KEYCLOAK_BASE_URL + "/realms/myrealm/protocol/openid-connect/token";
    private static final String CLIENT_ID = "salon-booking-client";
    private static final String CLIENT_SECRET = "P9xHtz9QHycCVKfMuD6dvwhisezAbjJA";
    private static final String GRANT_TYPE = "password";
    private static final String SCOPE = "openid email profile";
    private static final String USERNAME = "khushal";
    private static final String PASSWORD = "admin";
    private static final String clientId = "94b620a0-21eb-470e-a1e7-c40c0ab9e800";

    private final RestTemplate restTemplate;

    public void createUser(SignUpDTO signUpDTO) throws Exception {

        String ACCESS_TOKEN = getAdminAccessToken(USERNAME, PASSWORD, GRANT_TYPE, null)
                .getAccessToken();
        Credential credential = Credential.builder()
                                        .type("password")
                                        .value(signUpDTO.getPassword())
                                        .temporary(false)
                                        .build();
        String[] name = signUpDTO.getFullName().split(" ");
        String firstName = name[0];
        String lastName = name.length > 1
                ? String.join(" ", copyOfRange(name, 1, name.length))
                : "User";
        UserRequest userRequest = UserRequest.builder()
                                        .username(signUpDTO.getUsername())
                                        .email(signUpDTO.getEmail())
                                        .enabled(true)
                                        .firstName(firstName)
                                        .lastName(lastName)
                                        .credentials(new ArrayList<>())
                                        .build();
        userRequest.getCredentials().add(credential);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(ACCESS_TOKEN);

        HttpEntity<UserRequest> requestEntity = new HttpEntity<>(userRequest, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                KEYCLOAK_ADMIN_API_URL,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        if(response.getStatusCode() == HttpStatus.CREATED){
            System.out.println("user created successfully");

            KeycloakUserDTO user = fetchFirstUserByUsername(signUpDTO.getUsername(), ACCESS_TOKEN);

            KeycloakRole role = getRoleByName(clientId, ACCESS_TOKEN, signUpDTO.getRole().toString());

            assignRoleToUser(user.getId(), clientId, List.of(role),  ACCESS_TOKEN);
        }
        else{
            System.out.println("user creation failed");
            throw new Exception(response.getBody());
        }
    }

    public TokenResponse getAdminAccessToken(String username, String password, String grantType, String refreshToken) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", grantType);
        requestBody.add("client_id", CLIENT_ID);
        requestBody.add("client_secret", CLIENT_SECRET);
        requestBody.add("username", username);
        requestBody.add("password", password);
        requestBody.add("refresh_token", refreshToken);
        requestBody.add("scope", SCOPE);

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<TokenResponse> response = restTemplate.exchange(
                    TOKEN_URL,
                    HttpMethod.POST,
                    requestEntity,
                    TokenResponse.class);
            return response.getBody();
        } catch (org.springframework.web.client.HttpClientErrorException.Unauthorized e) {
            // Specifically catching 401 from Keycloak
            throw new Exception("401 Unauthorized: Invalid credentials");
        } catch (Exception e) {
            throw new Exception("Failed to obtain access token: " + e.getMessage());
        }
    }

    public KeycloakRole getRoleByName(String clientId, String token, String role) throws Exception {
        String url = KEYCLOAK_BASE_URL +"/admin/realms/myrealm/clients/"+clientId+"/roles/"+role;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<KeycloakRole> response = restTemplate.exchange(url,
                HttpMethod.GET,
                requestEntity,
                KeycloakRole.class);
        if(response.getBody() != null){
            return response.getBody();
        }
        throw new Exception("Failed to get Role");
    }

    public KeycloakUserDTO fetchFirstUserByUsername(String username, String token) throws Exception {
        String url = KEYCLOAK_BASE_URL +"/admin/realms/myrealm/users?username="+username;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<KeycloakUserDTO[]> response = restTemplate.exchange(url,
                HttpMethod.GET,
                requestEntity,
                KeycloakUserDTO[].class);
        KeycloakUserDTO[] users = response.getBody();

        if(users != null && users.length > 0){
            return response.getBody()[0];
        }
        throw new Exception("user not found with username "+ username);
    }

    public void assignRoleToUser(String userId,
                                 String clientId,
                                 List<KeycloakRole> roles,
                                 String token) throws Exception {
        String url = KEYCLOAK_BASE_URL +"/admin/realms/myrealm/users/"+userId+"/role-mappings/clients/"+clientId;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<List<KeycloakRole>> requestEntity = new HttpEntity<>(roles, headers);
        try{
            ResponseEntity<String> response = restTemplate.exchange(url,
                    HttpMethod.POST,
                    requestEntity,
                    String.class);
        }
        catch(Exception e){
            throw new Exception("Failed to assign new role"+ e.getMessage());
        }
    }

    public KeycloakUserDTO fetchUserProfileByJwt(String token) throws Exception {
        System.out.println("Token : "+token);
        String accessToken = token.replace("Bearer ", "");
        String url = KEYCLOAK_BASE_URL +"/realms/myrealm/protocol/openid-connect/userinfo";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        try{
            ResponseEntity<KeycloakUserDTO> response = restTemplate.exchange(url,
                    HttpMethod.GET,
                    requestEntity,
                    KeycloakUserDTO.class);
            return response.getBody();
        }
        catch(Exception e){
            throw new Exception("Failed to get user profile. "+ e.getMessage());
        }
    }

}
