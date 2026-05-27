package com.ark.AviClear.service;

import com.ark.AviClear.config.RestClientConfig;
import com.ark.AviClear.dto.NotamResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
@Service
public class NotamService {

    private final RestClient skyLinkClient;
    private final ChatClient chatClient;

    public NotamService(@Qualifier("skyLinkClient") RestClient skyLinkClient, ChatClient.Builder chatClient) {
        this.skyLinkClient = skyLinkClient;
        this.chatClient = chatClient.build();
    }


    public NotamResponse fetchNotams(String icao) {
        NotamResponse response = skyLinkClient
                .get()
                .uri("/notams/{icao}", icao)
                .retrieve()
                .body(NotamResponse.class);

        // Limit to first 5 to avoid rate limiting during development
        if (response != null && response.getNotams() != null) {
            response.setNotams(response.getNotams().subList(0,
                    Math.min(5, response.getNotams().size())));
        }
        return response;
    }

    public String classifyNotam(String body) {
        return chatClient
                .prompt()
                .system("You are an aviation safety assistant. Classify this NOTAM as exactly one word: CRITICAL, SIGNIFICANT, or ROUTINE. Reply with only that one word, nothing else.")
                .user(body)
                .call()
                .content();
    }

    public String summarizeNotam(String body) {
        return chatClient
                .prompt()
                .system("You are an aviation assistant. Summarize this NOTAM in one plain-English sentence a student pilot can understand. Do not use aviation jargon without explaining it.")
                .user(body)
                .call()
                .content();
    }
}
