package com.ark.AviClear.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class NotamResponse {
    private String icao;
    @JsonProperty("total_count")
    private Integer count;
    private List<NotamDto> notams;
}
