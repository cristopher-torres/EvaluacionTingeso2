package com.toolrent.user_service.Service;
import com.toolrent.user_service.Entity.UserEntity;
import com.toolrent.user_service.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserEntity save(UserEntity user) {
        Optional<UserEntity> existingUser = userRepository.findByRut(user.getRut());
        if (existingUser.isPresent()) {
            throw new RuntimeException("El RUT ya está registrado.");
        }
        // Estado por defecto al crear
        if (user.getStatus() == null || user.getStatus().isEmpty()) {
            user.setStatus("ACTIVO");
        }
        return userRepository.save(user);
    }

    public List<UserEntity> findAll() {
        return userRepository.findAll();
    }

    public UserEntity findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public UserEntity findByRut(String rut) {
        return userRepository.findByRut(rut)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con RUT: " + rut));
    }

    // RF3.2: Cambiar estado a "RESTRINGIDO" (Llamado por M2 cuando hay atrasos)
    @Transactional
    public void restrictUserById(Long userId) {
        UserEntity user = findById(userId);
        if (!"RESTRINGIDO".equalsIgnoreCase(user.getStatus())) {
            user.setStatus("RESTRINGIDO");
            userRepository.save(user);
        }
    }

    // Reactivar usuario si paga multa (Llamado por M2)
    @Transactional
    public void updateUserStatus(Long userId, boolean finePaid) {
        UserEntity user = findById(userId);
        if (finePaid) {
            user.setStatus("ACTIVO");
        } else {
            user.setStatus("RESTRINGIDO");
        }
        userRepository.save(user);
    }

    public UserEntity updateUser(Long userId, UserEntity userDetails) {
        UserEntity user = findById(userId);

        user.setRut(userDetails.getRut());
        user.setName(userDetails.getName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setStatus(userDetails.getStatus());

        // Si mantienes lógica de login aquí
        user.setUsername(userDetails.getUsername());
        user.setRole(userDetails.getRole());

        return userRepository.save(user);
    }
}
