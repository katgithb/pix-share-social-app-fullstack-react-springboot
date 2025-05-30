package com.pixshare.pixshareapi.admin;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class PostCountEntry {
    private String periodLabel;
    private long count;
    private LocalDate date;
    private Integer month;
    private Integer year;
}