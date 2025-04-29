package org.example.cafeforus.model;

public enum Level {
    BASIC(1),
    SILVER(2),
    GOLD(3),
    VIP(4),
    ADMIN(5);

    private final int priority;
    Level(int priority) {
        this.priority = priority;
    }
    public int getPriority() {
        return priority;
    }
    public static Level formString(String levelStr) {
        return Level.valueOf(levelStr.toUpperCase());
    }
}
