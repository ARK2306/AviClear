package com.ark.AviClear.service;

import com.ark.AviClear.dto.*;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BriefingService {
    private final MetarService metarService;
    private final NotamService notamService;
    private final ChatClient chatClient;
    private final FlightRulesService flightRulesService;

    public BriefingService(MetarService metarService, NotamService notamService, ChatClient.Builder chatClient, FlightRulesService FlightRulesService) {
        this.metarService = metarService;
        this.notamService = notamService;
        this.chatClient = chatClient.build();
        this.flightRulesService =  FlightRulesService;
    }

    public BriefingResponse fetchBriefing(BriefingRequest request){
       MetarResponse departureMetar = metarService.fetchRawMetar(request.getDeparture());
       NotamResponse departureNotam = notamService.fetchNotams(request.getDeparture());
       MetarResponse destinationMetar = metarService.fetchRawMetar(request.getDestination());
       NotamResponse destinationNotam = notamService.fetchNotams(request.getDestination());

        List<NotamBriefing> departureNotams = classifyNotams(departureNotam);
        List<NotamBriefing> destinationNotams = classifyNotams(destinationNotam);

        String userMessage = String.format("""
    Flight: %s → %s at %s
    
    Departure METAR (%s): %s | Flight Category: %s
    Destination METAR (%s): %s | Flight Category: %s
    
    Departure NOTAMs: %s
    Destination NOTAMs: %s
    """,
                request.getDeparture(), request.getDestination(), request.getDepartureTime(),
                departureMetar.getIcaoId(), departureMetar.getRawOb(), flightRulesService.classify(departureMetar),
                destinationMetar.getIcaoId(), destinationMetar.getRawOb(), flightRulesService.classify(destinationMetar),
                departureNotams.stream().map(nb -> nb.getNotam().getBody()).toList(),
                destinationNotams.stream().map(nb -> nb.getNotam().getBody()).toList()
        );

        String briefing = chatClient
                .prompt()
                .system("You are AviClear, an AI aviation briefing assistant. Given weather and NOTAM data \n" +
                        "for a flight, generate a concise preflight briefing covering:\n" +
                        "1. Adverse Conditions\n" +
                        "2. Departure Weather\n" +
                        "3. Destination Weather  \n" +
                        "4. NOTAMs of note\n" +
                        "5. Overall recommendation\n" +
                        "\n" +
                        "Keep it under 200 words. Plain English. Flag anything safety-critical.")
                .user(userMessage)
                .call()
                .content();

        BriefingResponse response = new BriefingResponse();
        response.setDeparture(request.getDeparture());
        response.setDestination(request.getDestination());
        response.setDepartureTime(request.getDepartureTime());
        response.setDepartureMetar(departureMetar);
        response.setArrivalMetar(destinationMetar);
        response.setBriefing(briefing);
        response.setDepartureNotams(departureNotams);
        response.setDestinationNotams(destinationNotams);
        return response;

    }
    private List<NotamBriefing> classifyNotams(NotamResponse notamResponse) {
        List<NotamBriefing> briefings = new ArrayList<>();
        for (NotamDto notam : notamResponse.getNotams()) {
            NotamBriefing briefing = new NotamBriefing();
            briefing.setNotam(notam);
            briefing.setSeverity(notamService.classifyNotam(notam.getBody()));
            briefing.setSummary(notamService.summarizeNotam(notam.getBody()));
            briefings.add(briefing);
        }
        return briefings;
    }


}
