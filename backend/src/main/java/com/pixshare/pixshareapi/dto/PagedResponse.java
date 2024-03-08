package com.pixshare.pixshareapi.dto;

import java.util.List;

public record PagedResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalRecords,
        int totalPages,
        boolean last
) {
}
