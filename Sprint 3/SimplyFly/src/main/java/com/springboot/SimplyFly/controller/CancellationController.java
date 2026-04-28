package com.springboot.SimplyFly.controller;

import com.springboot.SimplyFly.dto.CancellationRequestDto;
import com.springboot.SimplyFly.dto.CancellationResponseDto;
import com.springboot.SimplyFly.repository.CancellationRepository;
import com.springboot.SimplyFly.service.CancellationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/cancellations")
@CrossOrigin(origins = "http://localhost:5173/")

public class CancellationController {

    private final CancellationService cancellationService;

    @PostMapping("/request")
    public ResponseEntity<?> requestCancellation(@RequestBody CancellationRequestDto requestDto, Principal principal){
        cancellationService.requestCancellation(requestDto,principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/owner/pending")
    public List<CancellationResponseDto> getPending(Principal principal){
        return cancellationService.getPendingCancellations(principal.getName());
    }

    @GetMapping("/owner/all")
    public List<CancellationResponseDto> getAll(Principal principal){
        return cancellationService.getAllCancellations(principal.getName());
    }

    @PutMapping("/owner/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable long id, Principal principal){
        cancellationService.rejectCancellation(id,principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/owner/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable long id, Principal principal){
        cancellationService.approveCancellation(id,principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }




}
