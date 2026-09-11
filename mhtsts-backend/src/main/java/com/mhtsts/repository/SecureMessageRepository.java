package com.mhtsts.repository;

import com.mhtsts.entity.SecureMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecureMessageRepository extends JpaRepository<SecureMessage, Long> {
}
