package com.ark.AviClear.controller;

import com.ark.AviClear.dto.MetarResponse;
import com.ark.AviClear.service.MetarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class MetarController {
    private final MetarService metarService;

    @GetMapping("/metar")
    public ResponseEntity<MetarResponse> getMetar(@RequestParam String icao){
        return ResponseEntity.ok(metarService.fetchRawMetar(icao));
    }
    @GetMapping("/metar/translate")
    public ResponseEntity<String> translateMetar(@RequestParam String icao){
        return ResponseEntity.ok(metarService.translateMetar(metarService.fetchRawMetar(icao)));
    }

}
