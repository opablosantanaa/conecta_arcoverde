package com.prefeitura.arcoverde.util;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.*;

class DateUtilTest {

    @Test
    void deveRetornarHoraNoFusoDeRecife() {
        LocalDateTime agora = DateUtil.agora();
        assertNotNull(agora);
        // O horário retornado deve estar coerente com America/Recife
        LocalDateTime referencia = LocalDateTime.now(ZoneId.of("America/Recife"));
        assertTrue(Math.abs(java.time.Duration.between(agora, referencia).toSeconds()) < 5);
    }

    @Test
    void zonaDeveSerAmericaRecife() {
        assertEquals("America/Recife", DateUtil.ZONA_ARCOVERDE.getId());
    }
}