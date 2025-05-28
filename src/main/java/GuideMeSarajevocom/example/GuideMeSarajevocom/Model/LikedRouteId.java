package GuideMeSarajevocom.example.GuideMeSarajevocom.Model;

import java.io.Serializable;
import java.util.Objects;

public class LikedRouteId implements Serializable {
    private Integer userId;
    private Integer routeId;

    public LikedRouteId() {}

    public LikedRouteId(Integer userId, Integer routeId) {
        this.userId = userId;
        this.routeId = routeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LikedRouteId)) return false;
        LikedRouteId that = (LikedRouteId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(routeId, that.routeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, routeId);
    }
}


