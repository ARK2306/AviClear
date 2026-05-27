package com.ark.AviClear.controller;

import com.ark.AviClear.dto.BriefingRequest;
import com.ark.AviClear.dto.BriefingResponse;
import com.ark.AviClear.service.BriefingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/briefing")
@RequiredArgsConstructor
public class BriefingController {

    private final BriefingService briefingService;

    @PostMapping
    public BriefingResponse getBriefing(@RequestBody BriefingRequest briefingRequest){
        return briefingService.fetchBriefing(briefingRequest);
    }


}
