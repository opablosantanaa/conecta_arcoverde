package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.response.AreaPopularResponse;
import com.prefeitura.arcoverde.repository.AreaInteresseRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final AreaInteresseRepository areaInteresseRepository;

    public PublicController(AreaInteresseRepository areaInteresseRepository) {
        this.areaInteresseRepository = areaInteresseRepository;
    }

    @GetMapping("/areas-populares")
    public List<AreaPopularResponse> getAreasPopulares() {
        return areaInteresseRepository.countAreasPorInteresse().stream()
                .map(row -> new AreaPopularResponse(
                        (String) row[0],
                        (Long) row[1]
                ))
                .toList();
    }
}