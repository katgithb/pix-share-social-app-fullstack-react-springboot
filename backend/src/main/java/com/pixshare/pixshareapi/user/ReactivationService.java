package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.dto.PageRequestDTO;
import com.pixshare.pixshareapi.dto.PagedResponse;
import com.pixshare.pixshareapi.dto.ReactivationRequestDTO;
import com.pixshare.pixshareapi.exception.RequestValidationException;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;

public interface ReactivationService {

    MessageResponse createReactivationRequest(String email) throws RequestValidationException;

    PagedResponse<ReactivationRequestDTO> getReactivationRequests(String status, PageRequestDTO pageRequest);

    ReactivationRequestDTO getReactivationRequestById(Long requestId) throws ResourceNotFoundException;

    MessageResponse reviewReactivationRequest(Long requestId, String requestStatus)
            throws ResourceNotFoundException, RequestValidationException;

}