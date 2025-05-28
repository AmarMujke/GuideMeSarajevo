package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import lombok.Data;

import java.io.Serializable;

@Data
public class BookedRouteId implements Serializable {
    private Integer userId;
    private Integer routeId;
}
