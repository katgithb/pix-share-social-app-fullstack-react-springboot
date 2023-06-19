package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.exception.DuplicateResourceException;
import com.pixshare.pixshareapi.exception.RequestValidationException;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserDTOMapper userDTOMapper;

    public UserServiceImpl(UserRepository userRepository, UserDTOMapper userDTOMapper) {
        this.userRepository = userRepository;
        this.userDTOMapper = userDTOMapper;
    }

    @Override
    public boolean existsUserWithId(Long userId) {
        return userRepository.existsUserById(userId);
    }

    @Override
    public boolean existsUserWithEmail(String email) {
        return userRepository.existsUserByEmail(email);
    }

    @Override
    public void registerUser(UserRegistrationRequest registrationRequest) throws ResourceNotFoundException {
        // check if email exists
        String email = registrationRequest.email();
        if (existsUserWithEmail(email)) {
            throw new DuplicateResourceException("This email is already taken");
        }

        // save
        User user = new User(registrationRequest.username(),
                registrationRequest.email(),
                registrationRequest.password(),
                registrationRequest.name(),
                registrationRequest.gender());
        userRepository.save(user);
    }

    @Override
    public void updateUser(Long userId, UserUpdateRequest updateRequest) throws ResourceNotFoundException {
        // can be used to avoid database query
        // User user = userRepository.getReferenceById(userId)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        Map<Object, Map<Object, Consumer<User>>> fieldUpdateMap = populateFieldUpdateMap(updateRequest, user);

        boolean changes = fieldUpdateMap.values()
                .stream()
                .map(entry -> entry.values().stream().findFirst().map(action -> {
                                    action.accept(user);
                                    return true;
                                })
                                .orElse(false)
                )
                .reduce(false, (accumulator, change) -> accumulator || change);

        if (!changes) {
            throw new RequestValidationException("No data changes found");
        }

        userRepository.save(user);
    }

    @Override
    public void deleteUserById(Long userId) throws ResourceNotFoundException {
        if (!existsUserWithId(userId)) {
            throw new ResourceNotFoundException("User with id [%s] not found".formatted(userId));
        }

        userRepository.deleteById(userId);
    }

    @Override
    public UserDTO findUserById(Long userId) throws ResourceNotFoundException {
        return userRepository.findById(userId)
                .map(userDTOMapper)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
    }

    @Override
    public UserDTO findUserByUsername(String username) throws ResourceNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return userDTOMapper.apply(user);
    }

    @Override
    public UserDTO findUserProfile(String token) throws ResourceNotFoundException {
        return null;
    }

    @Override
    public String followUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException {
        User reqUser = userRepository.findById(reqUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(reqUserId)));
        User followUser = userRepository.findById(followUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(followUserId)));

        UserView follower = new UserView();
        populateFollower(reqUser, follower);

        UserView following = new UserView();
        populateFollowing(followUser, following);

        reqUser.getFollowing().add(following);
        followUser.getFollower().add(follower);

        userRepository.save(reqUser);
        userRepository.save(followUser);

        return "You are following " + followUser.getUsername();
    }

    @Override
    public String unfollowUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException {
        User reqUser = userRepository.findById(reqUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(reqUserId)));
        User followUser = userRepository.findById(followUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(followUserId)));

        UserView follower = new UserView();
        populateFollower(reqUser, follower);

        UserView following = new UserView();
        populateFollowing(followUser, following);

        reqUser.getFollowing().remove(following);
        followUser.getFollower().remove(follower);

        userRepository.save(reqUser);
        userRepository.save(followUser);

        return "You have unfollowed " + followUser.getUsername();
    }

    @Override
    public List<UserDTO> findUserByIds(List<Long> userIds) throws ResourceNotFoundException {
        List<UserDTO> users = userRepository.findAllUsersByUserIds(userIds).stream()
                .map(userDTOMapper)
                .collect(Collectors.collectingAndThen(Collectors.toList(), result -> {
                    if (result.isEmpty()) throw new ResourceNotFoundException("User not found");
                    return result;
                }));

        return users;
    }

    @Override
    public List<UserDTO> searchUser(String searchQuery) throws ResourceNotFoundException {
        List<UserDTO> users = userRepository.findByQuery(searchQuery).stream()
                .map(userDTOMapper)
                .collect(Collectors.collectingAndThen(Collectors.toList(), result -> {
                    if (result.isEmpty()) throw new ResourceNotFoundException("User not found");
                    return result;
                }));

        return users;
    }

    @Override
    public List<UserDTO> findPopularUsers(Long userId) throws ResourceNotFoundException {
        User reqUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        List<UserDTO> users = userRepository.findPopularUsers(reqUser.getId()).stream()
                .map(userDTOMapper)
                .collect(Collectors.toList());

        return users;
    }

    private void populateFollower(User reqUser, UserView follower) {
        follower.setId(reqUser.getId());
        follower.setUsername(reqUser.getUsername());
        follower.setEmail(reqUser.getEmail());
        follower.setName(reqUser.getName());
        follower.setUserImage(reqUser.getUserImage());
    }

    private void populateFollowing(User followUser, UserView following) {
        following.setId(followUser.getId());
        following.setUsername(followUser.getUsername());
        following.setEmail(followUser.getEmail());
        following.setName(followUser.getName());
        following.setUserImage(followUser.getUserImage());
    }

    private boolean isFieldValueChanged(Object newValue, Object currentValue) {
        return Optional.ofNullable(newValue)
                .filter(value -> !value.equals(currentValue))
                .isPresent();
    }

    // Helper method to create field update entries
    private <T> Map.Entry<Object, Map<Object, Consumer<User>>> fieldUpdateEntry(T reqField, T userField, Consumer<User> consumer) {
        return isFieldValueChanged(reqField, userField)
                ? Map.entry(reqField, Collections.singletonMap(userField, consumer))
                : null;
    }

    private Map<Object, Map<Object, Consumer<User>>> populateFieldUpdateMap(UserUpdateRequest updateRequest, User user) {
        return Optional.ofNullable(updateRequest)
                .map(req -> Stream.of(
                                fieldUpdateEntry(req.username(), user.getUsername(), c -> c.setUsername(req.username())),
                                fieldUpdateEntry(req.email(), user.getEmail(), c -> {
                                    if (existsUserWithEmail(req.email())) {
                                        throw new DuplicateResourceException("This email is already taken");
                                    }
                                    c.setEmail(req.email());
                                }),
                                fieldUpdateEntry(req.password(), user.getPassword(), c -> c.setPassword(req.password())),
                                fieldUpdateEntry(req.name(), user.getName(), c -> c.setName(req.name())),
                                fieldUpdateEntry(req.mobile(), user.getMobile(), c -> c.setMobile(req.mobile())),
                                fieldUpdateEntry(req.website(), user.getWebsite(), c -> c.setWebsite(req.website())),
                                fieldUpdateEntry(req.bio(), user.getBio(), c -> c.setBio(req.bio())),
                                fieldUpdateEntry(req.gender(), user.getGender(), c -> c.setGender(req.gender())),
                                fieldUpdateEntry(req.userImage(), user.getUserImage(), c -> c.setUserImage(req.userImage()))
                        )
                        .filter(Objects::nonNull)
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)))
                .orElse(Collections.emptyMap());
    }

}
