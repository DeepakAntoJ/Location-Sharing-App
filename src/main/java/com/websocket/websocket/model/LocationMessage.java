package com.websocket.websocket.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString

public class LocationMessage {
    private String latitude;
    private String longitude;
    private String userName;
    private Status status;
}
