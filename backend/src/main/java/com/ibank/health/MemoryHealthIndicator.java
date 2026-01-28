package com.ibank.health;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;

/**
 * Health check para monitorar memória JVM
 */
@Component
public class MemoryHealthIndicator implements HealthIndicator {

    private static final double MEMORY_THRESHOLD = 0.9; // 90%

    @Override
    public Health health() {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        MemoryUsage heapUsage = memoryBean.getHeapMemoryUsage();
        
        long used = heapUsage.getUsed();
        long max = heapUsage.getMax();
        double usage = (double) used / max;
        
        Health.Builder builder = usage < MEMORY_THRESHOLD ? Health.up() : Health.down();
        
        return builder
                .withDetail("used", formatBytes(used))
                .withDetail("max", formatBytes(max))
                .withDetail("percentage", String.format("%.2f%%", usage * 100))
                .withDetail("threshold", String.format("%.2f%%", MEMORY_THRESHOLD * 100))
                .build();
    }
    
    private String formatBytes(long bytes) {
        long mb = bytes / (1024 * 1024);
        return mb + " MB";
    }
}
