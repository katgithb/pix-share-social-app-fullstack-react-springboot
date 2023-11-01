package com.pixshare.pixshareapi.validation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ValidationUtil {

    private final Validator validator;

    public ValidationUtil(Validator validator) {
        this.validator = validator;
    }

    public <T> void performValidation(T entity) {
        Set<ConstraintViolation<T>> violations = validator.validate(entity);

        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
    }

    public <T> void performValidation(T entity, List<String> excludedValidationFields) {
        List<String> allFields = getAllFieldsFromEntity(entity.getClass());

        Set<ConstraintViolation<T>> allViolations = allFields
                .stream()
                .filter(name -> !excludedValidationFields.contains(name))
                .map(field -> validator.validateProperty(entity, field))
                .flatMap(Set::stream)
                .collect(Collectors.toSet());

        if (!allViolations.isEmpty()) {
            throw new ConstraintViolationException(allViolations);
        }
    }

    public <T> void performValidationOnField(Class<T> clazz, String fieldName, Object fieldValue) {
        Set<ConstraintViolation<T>> violations = validator.validateValue(clazz, fieldName, fieldValue);

        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
    }

    private List<String> getAllFieldsFromEntity(Class<?> clazz) {

        return Arrays.stream(clazz.getDeclaredFields())
                .map(Field::getName)
                .collect(Collectors.toList());

    }

}
