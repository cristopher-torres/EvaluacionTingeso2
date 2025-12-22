package com.ToolRent.ToolRent.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(unique = true, nullable = false)
    private String rut;

    private String name;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String status;

    @Column(unique = true, nullable = false)
    private String username;

    private String role;

}
