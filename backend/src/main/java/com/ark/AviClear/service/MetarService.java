package com.ark.AviClear.service;

import com.ark.AviClear.dto.MetarResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class MetarService {
    private final RestClient aviationWeatherClient;
    private final ChatClient chatClient;
    private final FlightRulesService flightRulesService;

    public MetarService(RestClient aviationWeatherClient, ChatClient.Builder chatClient, FlightRulesService FlightRulesService) {
        this.aviationWeatherClient = aviationWeatherClient;
        this.chatClient = chatClient.build();
        this.flightRulesService = FlightRulesService;
    }

    @Cacheable("metar")
    public MetarResponse fetchRawMetar(String icao) {
        System.out.println("Calling: " + "/metar?ids=" + icao );
        MetarResponse[] responses = aviationWeatherClient
                .get()
                .uri("/metar?ids={icao}&format=json", icao)
                .retrieve()
                .body(MetarResponse[].class);

        return responses[0];

    }

    public String translateMetar(MetarResponse metarResponse){
        String userMessage = String.format(
                "Airport: %s\nRaw METAR: %s\nTemperature: %s°C\nDewpoint: %s°C\nWind: %s° at %s knots\nVisibility: %s SM\nAltimeter: %s hPa\nFlight Category: %s",
                metarResponse.getName(),
                metarResponse.getRawOb(),
                metarResponse.getTemp(),
                metarResponse.getDewp(),
                metarResponse.getWdir(),
                metarResponse.getWspd(),
                metarResponse.getVisib(),
                metarResponse.getAltim(),
                flightRulesService.classify(metarResponse)
        );
       return  chatClient
                .prompt()
                .system("You are AviClear, an AI assistant that helps student pilots understand weather reports. \n" +
                        "When given METAR data, explain it in plain English in under 100 words. \n" +
                        "Cover the key conditions: visibility, ceiling, wind, and flight category. \n" +
                        "Flag any notable or hazardous conditions clearly. \n" +
                        "Do not use aviation jargon without explaining it.")
                .user(userMessage)
                .call()
                .content();
    }

}
