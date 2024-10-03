package com.websocket.websocket.controller;

import com.websocket.websocket.model.LocationMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class LocationController {
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public LocationMessage sendMessage(@Payload LocationMessage locationMessage) {

        return locationMessage;
    }
}
