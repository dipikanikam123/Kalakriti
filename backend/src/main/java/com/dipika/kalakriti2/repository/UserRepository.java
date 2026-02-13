package com.dipika.kalakriti2.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dipika.kalakriti2.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

   

    boolean existsByEmail(String email);

    boolean existsByName(String name);

	Optional<UserEntity> findByname(String name);
}
