package com.mhtsts.exception;

public class LicenseExpiredException extends RuntimeException {
    public LicenseExpiredException(String message) {
        super(message);
    }
}
