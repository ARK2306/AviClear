package com.ark.AviClear.dto;


import lombok.Data;

import java.util.List;

@Data
public class BriefingResponse {
    private String departure;
    private String destination;
    private String departureTime;
    private MetarResponse departureMetar;
    private MetarResponse arrivalMetar;
    private List<NotamBriefing> departureNotams;
    private List<NotamBriefing> destinationNotams;
    private String briefing;
}
