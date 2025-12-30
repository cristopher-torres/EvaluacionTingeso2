package com.toolrent.loan_service.Repository;


import com.toolrent.loan_service.Entity.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<LoanEntity, Long> {

    List<LoanEntity> findByClientId(Long clientId);

    @Query("SELECT l FROM LoanEntity l WHERE l.delivered = false ORDER BY l.createdLoan DESC")
    List<LoanEntity> findActiveLoansOrderedByDateDesc();

    @Query("SELECT l FROM LoanEntity l WHERE l.delivered = false AND l.startDate BETWEEN :startDate AND :endDate")
    List<LoanEntity> findActiveLoansByDateRange(LocalDate startDate, LocalDate endDate);

    @Query("SELECT l FROM LoanEntity l WHERE l.loanStatus = 'ATRASADO' AND l.scheduledReturnDate < :today")
    List<LoanEntity> findOverdueLoans(LocalDate today);

    @Query("SELECT l FROM LoanEntity l WHERE l.loanStatus = 'ATRASADO' AND l.scheduledReturnDate < :today AND l.startDate BETWEEN :startDate AND :endDate")
    List<LoanEntity> findOverdueLoansByDate(LocalDate today, LocalDate startDate, LocalDate endDate);

    // Usamos el snapshot 'toolName'
    @Query("SELECT l.toolName, COUNT(l) FROM LoanEntity l WHERE l.startDate BETWEEN :startDate AND :endDate GROUP BY l.toolName ORDER BY COUNT(l) DESC")
    List<Object[]> findTopLentToolsByName(LocalDate startDate, LocalDate endDate);

    @Query("SELECT l.toolName, COUNT(l) FROM LoanEntity l GROUP BY l.toolName ORDER BY COUNT(l) DESC")
    List<Object[]> findTopLentToolsAllTime();

    List<LoanEntity> findByFinePaidFalse();

    // Verificador local
    @Query("SELECT COUNT(l) > 0 FROM LoanEntity l WHERE l.clientId = :clientId AND l.toolName = :toolName AND l.delivered = false")
    boolean existsActiveLoanForToolAndUser(Long clientId, String toolName);

    long countByClientIdAndDeliveredFalse(Long clientId);
}