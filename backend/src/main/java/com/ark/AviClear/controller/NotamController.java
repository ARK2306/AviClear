package com.ark.AviClear.controller;

import com.ark.AviClear.dto.NotamBriefing;
import com.ark.AviClear.dto.NotamDto;
import com.ark.AviClear.dto.NotamResponse;
import com.ark.AviClear.service.NotamService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/notam")
@RequiredArgsConstructor
public class NotamController {
    private final NotamService notamService;

    @GetMapping
    public NotamResponse fetchNotams(@RequestParam String icao){
        return notamService.fetchNotams(icao);
    }
    @GetMapping("/classify")
    public List<NotamBriefing> classifyAndSummarizeNotam(@RequestParam String icao){
        NotamResponse notams = notamService.fetchNotams(icao);
        List<NotamBriefing> briefings = new ArrayList<>();
        for (NotamDto notam : notams.getNotams()) {
            NotamBriefing briefing = new NotamBriefing();
            briefing.setNotam(notam);
            briefing.setSeverity(notamService.classifyNotam(notam.getBody()));
            briefing.setSummary(notamService.summarizeNotam(notam.getBody()));
            briefings.add(briefing);
        }
        return briefings;
    }
}
