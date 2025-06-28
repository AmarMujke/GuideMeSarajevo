package GuideMeSarajevocom.example.GuideMeSarajevocom.DTO;

import java.math.BigDecimal;

public class LikedRouteDTO {
    private int routeId;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String itinerary;

    // Getters and setters
    public int getRouteId() { return routeId; }
    public void setRouteId(int routeId) { this.routeId = routeId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getItinerary() { return itinerary; }
    public void setItinerary(String itinerary) { this.itinerary = itinerary; }
}
