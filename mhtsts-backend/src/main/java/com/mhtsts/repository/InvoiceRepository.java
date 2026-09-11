package com.mhtsts.repository;

import com.mhtsts.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByClientIdOrderByServiceDateDesc(Long clientId);
    List<Invoice> findAllByOrderByServiceDateDesc();
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
}
