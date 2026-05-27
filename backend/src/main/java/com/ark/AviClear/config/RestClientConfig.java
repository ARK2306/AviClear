package com.ark.AviClear.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient aviationWeatherClient() {
        return RestClient.builder()
                .baseUrl("https://aviationweather.gov/api/data")
                .defaultHeader("Accept","application/json")
                .build();
    }

    @Bean
    public RestClient skyLinkClient(@Value("${RAPIDAPI_KEY}") String rapidApiKey){
        return RestClient.builder()
                .baseUrl("https://skylink-api.p.rapidapi.com")
                .defaultHeader("x-rapidapi-key", rapidApiKey)
                .defaultHeader("x-rapidapi-host", "skylink-api.p.rapidapi.com")
                .build();
    }
}
