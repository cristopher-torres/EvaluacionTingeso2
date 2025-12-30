package com.toolrent.loan_service.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String rut;
    private String name;
    private String lastname;
    private String email;
    private String status;
}
