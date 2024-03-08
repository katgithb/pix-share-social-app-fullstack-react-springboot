package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.util.AppConstants;
import lombok.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class PageRequestDTO {
    private Integer page = AppConstants.DEFAULT_PAGE_NUMBER;
    private Integer size = AppConstants.DEFAULT_PAGE_SIZE;
    private String sortBy = AppConstants.DEFAULT_SORT_BY;
    private String sortDir = AppConstants.DEFAULT_SORT_DIRECTION;

    public Pageable toPageable() {
        Sort.Direction direction = Sort.Direction.fromOptionalString(sortDir)
                .orElse(Sort.Direction.fromString(AppConstants.DEFAULT_SORT_DIRECTION));

        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }

}
