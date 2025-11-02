package com.managementappbackend.service.application;

import com.managementappbackend.dto.CreateCommentDto;
import com.managementappbackend.dto.DisplayCommentDto;

import java.util.List;
import java.util.Optional;

public interface CommentApplicationService {
    List<DisplayCommentDto> findAll();
    Optional<DisplayCommentDto> findById(Long id);
    Optional<DisplayCommentDto> save(CreateCommentDto createCommentDto);
    Optional<DisplayCommentDto> update(Long id,CreateCommentDto updateCommentDto);
    List<DisplayCommentDto> findByUser();
    List<DisplayCommentDto> findByTask(Long taskId);
    void deleteById(Long commentId);
}
