package com.crs.model.service;

import com.crs.feign.HotelClient;
import com.crs.feign.PaymentClient;  
import com.crs.model.dto.EditReservationRequestDto;
import com.crs.model.dto.InitiatePaymentDto;
import com.crs.model.dto.ReservationDto;
import com.crs.model.dto.ReserveRoomRequestDto;
import com.crs.model.dto.RoomDto;
import com.crs.model.entity.Reservation;
import com.crs.model.entity.Reservation.PaymentStatus;
import com.crs.model.entity.Reservation.Status;
import com.crs.model.exception.CustomException;
import com.crs.model.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;  
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private HotelClient hotelClient;

    @Autowired
    private PaymentClient paymentClient;  

    @EventListener(ApplicationReadyEvent.class)
    public void updateCompletedReservationsOnStartup() {
        updateCompletedReservations();
    }

    @Override
    public Reservation reserveRoom(ReserveRoomRequestDto request) {
        
        List<RoomDto> availableRooms = hotelClient.getRoomsByHotelAndType(
                request.getHotelId(), request.getRoomType()
        );

        if (availableRooms.isEmpty()) {
            throw new CustomException("No rooms of type " + request.getRoomType() + " found in hotel " + request.getHotelId());
        }

        List<Integer> roomIds = availableRooms.stream()
                .map(RoomDto::getRoomId)
                .toList();

        Integer assignedRoomId = null;
        for (Integer roomId : roomIds) {
            boolean isBooked = reservationRepository.existsByHotelIdAndRoomIdAndDateRange(
                    request.getHotelId(),
                    roomId,
                    request.getCheckInDate(),
                    request.getCheckOutDate()
            );

            if (!isBooked) {
                assignedRoomId = roomId;
                break;
            }
        }

        if (assignedRoomId == null) {
            throw new CustomException("No available rooms found for the given date range.");
        }

        Reservation reservation = Reservation.builder()
                .hotelId(request.getHotelId())
                .roomId(assignedRoomId)
                .customerId(request.getCustomerId())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .roomType(request.getRoomType())
                .reservationDate(LocalDateTime.now())
                .noOfGuests(request.getNoOfGuests())
                .status(Status.INCOMPLETE)
                .paymentStatus(Reservation.PaymentStatus.INCOMPLETE)
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);

        InitiatePaymentDto paymentDto = InitiatePaymentDto.builder()
                .reservationId(savedReservation.getReservationId())
                .customerId(savedReservation.getCustomerId())
                .roomId(assignedRoomId)
                .checkInDate(savedReservation.getCheckInDate())
                .checkOutDate(savedReservation.getCheckOutDate())
                .build();

        paymentClient.initiatePayment(paymentDto);

        return savedReservation;
    }

    @Override
    public Reservation editReservation(Integer reservationId, EditReservationRequestDto dto) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new CustomException("Reservation not found"));

        Status status = reservation.getStatus();

        if (status == Status.BOOKED || status == Status.COMPLETED || status == Status.CANCELLED) {
            throw new CustomException(status + " reservations cannot be edited.");
        }

        List<RoomDto> availableRooms = hotelClient.getRoomsByHotelAndType(
            dto.getHotelId(), dto.getRoomType()
        );
        
        if (availableRooms.isEmpty()) {
            throw new CustomException("No rooms of type " + dto.getRoomType() +
                    " found in hotel " + dto.getHotelId());
        }
    
        List<Integer> roomIds = availableRooms.stream()
                .map(RoomDto::getRoomId)
                .toList();
    
        Integer assignedRoomId = null;
        for (Integer roomId : roomIds) {
            boolean isBooked = reservationRepository.existsByHotelIdAndRoomIdAndDateRange(
                    dto.getHotelId(),
                    roomId,
                    dto.getCheckInDate(),
                    dto.getCheckOutDate()
            );
    
            if (!isBooked) {
                assignedRoomId = roomId;
                break;
            }
        }
    
        if (assignedRoomId == null) {
            throw new CustomException("No available rooms for the selected dates.");
        }
    
        reservation.setHotelId(dto.getHotelId());
        reservation.setRoomId(assignedRoomId);
        reservation.setRoomType(dto.getRoomType());
        reservation.setCheckInDate(dto.getCheckInDate());
        reservation.setCheckOutDate(dto.getCheckOutDate());
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setNoOfGuests(dto.getNoOfGuests());

        Reservation savedReservation = reservationRepository.save(reservation);
    
        InitiatePaymentDto paymentDto = InitiatePaymentDto.builder()
                .reservationId(savedReservation.getReservationId())
                .customerId(savedReservation.getCustomerId())
                .roomId(assignedRoomId)
                .checkInDate(savedReservation.getCheckInDate())
                .checkOutDate(savedReservation.getCheckOutDate())
                .build();

        paymentClient.initiatePayment(paymentDto);

        return savedReservation;
    }

    @Override
    public void cancelReservation(Integer reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new CustomException("Reservation not found"));
        
        if (reservation.getStatus() == Status.BOOKED) {
            if (reservation.getPaymentStatus() == PaymentStatus.SUCCESS) {
                reservation.setPaymentStatus(PaymentStatus.REFUNDED);
            } else if (reservation.getPaymentStatus() == PaymentStatus.PENDING) {
                reservation.setPaymentStatus(PaymentStatus.INCOMPLETE);
            }
        } 
        
        reservation.setStatus(Status.CANCELLED);
        reservationRepository.save(reservation);
        paymentClient.deletePaymentByReservationId(reservationId);
        return;
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public List<Reservation> getReservationsByCustomerIdAndStatus(Integer customerId, Reservation.Status status) {
        return reservationRepository.findByCustomerIdAndStatus(customerId, status);
    }

    @Override
    public ReservationDto getReservationById(Integer reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new CustomException("Reservation not found with ID: " + reservationId));

        return ReservationDto.builder()
            .reservationId(reservation.getReservationId())
            .customerId(reservation.getCustomerId())
            .hotelId(reservation.getHotelId())
            .roomId(reservation.getRoomId())
            .roomType(reservation.getRoomType())
            .checkInDate(reservation.getCheckInDate())
            .checkOutDate(reservation.getCheckOutDate())
            .noOfGuests(reservation.getNoOfGuests())
            .build();
    }

    @Override
    public List<ReservationDto> getReservationsByHotelAndDate(Integer hotelId, LocalDate date) {
        List<Reservation> reservations = reservationRepository.findByHotelIdAndDate(hotelId, date);
        return reservations.stream()
                .map(res -> ReservationDto.builder()
                        .reservationId(res.getReservationId())
                        .customerId(res.getCustomerId())
                        .hotelId(res.getHotelId())
                        .roomId(res.getRoomId())
                        .roomType(res.getRoomType())
                        .checkInDate(res.getCheckInDate())
                        .checkOutDate(res.getCheckOutDate())
                        .noOfGuests(res.getNoOfGuests())
                        .build())
                    .toList();
    }

    @Override
    public boolean isRoomAvailable(Integer reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                        .orElseThrow(() -> new CustomException("Reservation not found."));

        boolean isBooked = reservationRepository.existsByHotelIdAndRoomIdAndDateRange(
            reservation.getHotelId(),
            reservation.getRoomId(),
            reservation.getCheckInDate(),
            reservation.getCheckOutDate());
        
        return (!isBooked);
    }

    @Transactional
    @Override
    public void updateReservationStatusBasedOnPayment(Integer reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new CustomException("Reservation not found"));

        Reservation.PaymentStatus paymentStatus = paymentClient.getPaymentStatusByReservationId(reservationId);
        reservation.setPaymentStatus(paymentStatus);

        if (paymentStatus == Reservation.PaymentStatus.FAILED) {
            if(!isRoomAvailable(reservationId)) {
                reservation.setStatus(Reservation.Status.CANCELLED);
            }
        } else if (paymentStatus == Reservation.PaymentStatus.PENDING || paymentStatus == Reservation.PaymentStatus.SUCCESS) {
            reservation.setStatus(Reservation.Status.BOOKED);  
        }

        reservation.setReservationDate(LocalDateTime.now());
        reservationRepository.save(reservation);
    }

    @Transactional
    @Override
    public void updateCompletedReservations() {
        LocalDate today = LocalDate.now();

        List<Reservation> reservations = reservationRepository.findByStatus(Reservation.Status.BOOKED);

        for (Reservation reservation : reservations) {
            if (reservation.getCheckOutDate().isBefore(today)) {
                reservation.setStatus(Reservation.Status.COMPLETED);
                reservationRepository.save(reservation);
            }
        }
    }
}