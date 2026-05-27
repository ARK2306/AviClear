package com.ark.AviClear.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class MetarResponse {
    private String icaoId;
    private String rawOb;
    private Float temp;
    private Float dewp;
    private Integer wdir;
    private Float wspd;
    private Float wgst;
    private String visib;
    private Float altim;
    private String fltCat;
    private String name;
    private List<CloudLayer> clouds;


}
