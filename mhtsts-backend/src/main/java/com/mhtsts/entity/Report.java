package com.mhtsts.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reportNumber;
    private String name;
    private String type;
    private String date;
    private String author;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "LONGTEXT")
    private String kpis;

    @Column(columnDefinition = "LONGTEXT")
    private String tableHeaders;

    @Column(columnDefinition = "LONGTEXT")
    private String tableRows;

    private LocalDateTime createdAt;

    public Report() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReportNumber() { return reportNumber; }
    public void setReportNumber(String reportNumber) { this.reportNumber = reportNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getKpis() { return kpis; }
    public void setKpis(String kpis) { this.kpis = kpis; }

    public String getTableHeaders() { return tableHeaders; }
    public void setTableHeaders(String tableHeaders) { this.tableHeaders = tableHeaders; }

    public String getTableRows() { return tableRows; }
    public void setTableRows(String tableRows) { this.tableRows = tableRows; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
