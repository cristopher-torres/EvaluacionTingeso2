package com.toolrent.user_service.Controller;

import com.toolrent.user_service.Entity.UserEntity;
import com.toolrent.user_service.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/createUser")
    public ResponseEntity<UserEntity> createUser(@RequestBody UserEntity user) {
        return ResponseEntity.ok(userService.save(user));
    }

    @GetMapping("/getUsers")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    // Endpoint necesario para que M2 busque al cliente por RUT antes de prestar
    @GetMapping("/rut/{rut}")
    public ResponseEntity<UserEntity> getUserByRut(@PathVariable String rut) {
        return ResponseEntity.ok(userService.findByRut(rut));
    }

    // Endpoint llamado por M2 para restringir al usuario por atrasos
    @PutMapping("/{userId}/restrict")
    public ResponseEntity<Void> restrictUser(@PathVariable Long userId) {
        userService.restrictUserById(userId);
        return ResponseEntity.ok().build();
    }

    // Endpoint llamado por M2 cuando se paga la multa
    @PutMapping("/{userId}/status")
    public ResponseEntity<String> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam boolean finePaid
    ) {
        userService.updateUserStatus(userId, finePaid);
        return ResponseEntity.ok("Estado del usuario actualizado correctamente");
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserEntity> updateUser(@PathVariable Long userId, @RequestBody UserEntity userDetails) {
        return ResponseEntity.ok(userService.updateUser(userId, userDetails));
    }
}