package com.dipika.kalakriti2.service;

import java.util.Collections;

import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;


@Service
public class GoogleAuthService {

    private static final String CLIENT_ID =
        "414653286779-eqvolh5vcsh2v4scivbet4ffoj2ouin3.apps.googleusercontent.com";

    public GoogleIdToken.Payload verify(String token) throws Exception {

        GoogleIdTokenVerifier verifier =
            new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance()
            )
            .setAudience(Collections.singletonList(CLIENT_ID))
            .build();

        GoogleIdToken idToken = verifier.verify(token);

        if (idToken == null) {
            throw new RuntimeException("Invalid Google Token");
        }

        return idToken.getPayload();
    }
}
