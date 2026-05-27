package com.ark.AviClear.dto;

import lombok.Data;

@Data
public class BriefingRequest {
    private String departure;
    private String destination;
    private String departureTime;
}
