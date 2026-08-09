package com.finpilot.banking.config;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class DatabaseInitializer {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void initialize() {

        String sql = """
            INSERT INTO user_roles (user_id, role_id)
            SELECT
                u.id,
                r.role_id
            FROM users u
            CROSS JOIN roles r
            WHERE r.role_name = 'ROLE_USER'
              AND NOT EXISTS (
                  SELECT 1
                  FROM user_roles ur
                  WHERE ur.user_id = u.id
              )
            """;

        jdbcTemplate.update(sql);
    }
}
