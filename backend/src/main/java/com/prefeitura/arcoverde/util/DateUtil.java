package com.prefeitura.arcoverde.util;

import java.time.LocalDateTime;
import java.time.ZoneId;

public final class DateUtil {
    public static final ZoneId ZONA_ARCOVERDE = ZoneId.of("America/Recife");

    private DateUtil() {}

    public static LocalDateTime agora() {
        return LocalDateTime.now(ZONA_ARCOVERDE);
    }
}