package com.CineEuxoulides.Euxoulides.MovieCon;
import lombok.Data;

import java.util.List;
@Data
public class TmdbCreditsResponse {

    private Long id;
    private List<MovieCastDTO> cast;

}