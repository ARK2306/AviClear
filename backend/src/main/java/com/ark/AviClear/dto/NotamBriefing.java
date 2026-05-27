package com.ark.AviClear.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class NotamBriefing {
    private NotamDto notam;
    private String severity;
    private String summary;
}
