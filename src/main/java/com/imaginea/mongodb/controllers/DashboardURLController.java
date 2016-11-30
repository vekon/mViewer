package com.imaginea.mongodb.controllers;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.io.InputStream;

/**
 * Created by satyad on 30/11/16.
 */
@Path("/")
public class DashboardURLController {

	@Path("{any: .*}")
    @GET
    @Produces({MediaType.TEXT_HTML})
    public InputStream viewHome()
    {	
        InputStream file = this.getClass().getResourceAsStream("/../../index.html");
        return file;
    }
}

