package com.ark.AviClear.service;

import com.ark.AviClear.dto.CloudLayer;
import com.ark.AviClear.dto.MetarResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightRulesService {

    public String classify(MetarResponse metar) {
        double visibility = parseVisibility(metar.getVisib());
        int ceiling = parseCeiling(metar.getClouds());

        if(visibility <1 || ceiling < 500){
            return "LIFR";
        } else if (visibility < 3 || ceiling <1000 ) {
            return "IFR";
        } else if (visibility <5 || ceiling < 3000 ) {
            return "MVFR";
        }
        return "VFR";
    }

    private double parseVisibility(String visib) {
        if(visib.startsWith("10+")){
            return 10;
        }else{
            return Double.parseDouble(visib);
        }
    }

    private int parseCeiling(List<CloudLayer> clouds) {
       int ceiling = Integer.MAX_VALUE;
        for (CloudLayer cloud : clouds) {
           if(cloud.getCover().equals("BKN") || cloud.getCover().equals("OVC")){
               if(cloud.getBase() < ceiling ){
                   ceiling = cloud.getBase();
               }
           }
       }
        return ceiling;
    }
}
