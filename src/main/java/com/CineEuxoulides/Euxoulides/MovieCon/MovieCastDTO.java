package com.CineEuxoulides.Euxoulides.MovieCon;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MovieCastDTO {

    private Long id;
    private String name;
    private String character;

    @JsonProperty("profile_path")
    private String profilePath;
}