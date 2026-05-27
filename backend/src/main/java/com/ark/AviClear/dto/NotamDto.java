package com.ark.AviClear.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class NotamDto {
    @JsonProperty("notam_id")
    private String notamId;
    private String type;
    private String location;
    private String effective;
    private String expiration;
    private String body;
    private String raw;

}
