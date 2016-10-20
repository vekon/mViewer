package com.imaginea.mongodb.services.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import com.imaginea.mongodb.domain.ConnectionDetails;
import com.imaginea.mongodb.domain.MongoConnectionDetails;
import com.imaginea.mongodb.exceptions.ApplicationException;
import com.imaginea.mongodb.exceptions.ErrorCodes;
import com.imaginea.mongodb.services.AuthService;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.MongoCredential;
import com.mongodb.MongoException;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;

import edu.emory.mathcs.backport.java.util.Arrays;
import edu.emory.mathcs.backport.java.util.Collections;

/**
 * @author Uday Shankar
 */
public class AuthServiceImpl implements AuthService {

  private static AuthService Auth_SERVICE = new AuthServiceImpl();

  private final AtomicLong SUCCESSFUL_CONNECTIONS_COUNT = new AtomicLong();
  private final Map<String, Collection<MongoConnectionDetails>> allConnectionDetails =
      new ConcurrentHashMap<String, Collection<MongoConnectionDetails>>();

  private AuthServiceImpl() {}

  @Override
  public String authenticate(ConnectionDetails connectionDetails) throws ApplicationException {
    sanitizeConnectionDetails(connectionDetails);
    String connectionDetailsHashCode = String.valueOf(connectionDetails.hashCode());
    boolean authMode = checkAuthMode(connectionDetails);
    connectionDetails.setAuthMode(authMode);
    if (authMode) {
      String username = connectionDetails.getUsername();
      String pwd = connectionDetails.getPassword();
      String db = connectionDetails.getDbNames();
      if (username == null || pwd == null || db == null) {
        throw new ApplicationException(ErrorCodes.NEED_AUTHORISATION,
                                       "Mongo DB Running in Auth Mode. Please perform Authentication.");
      }
    }
    Collection<MongoConnectionDetails> mongoConnectionDetailsList =
        allConnectionDetails.get(connectionDetailsHashCode);
    if (mongoConnectionDetailsList != null) {
      for (MongoConnectionDetails mongoConnectionDetails : mongoConnectionDetailsList) {
        if (connectionDetails.equals(mongoConnectionDetails.getConnectionDetails())) {
          return mongoConnectionDetails.getConnectionId();
        }
      }
    }

    MongoClient mongo = getMongoAndAuthenticate(connectionDetails);

    String connectionId =
        SUCCESSFUL_CONNECTIONS_COUNT.incrementAndGet() + "_" + connectionDetailsHashCode;
    if (mongoConnectionDetailsList == null) {
      mongoConnectionDetailsList = new ArrayList<MongoConnectionDetails>(1);
      allConnectionDetails.put(connectionDetailsHashCode, mongoConnectionDetailsList);
    }
    mongoConnectionDetailsList
        .add(new MongoConnectionDetails(connectionDetails, mongo, connectionId));

    return connectionId;
  }

  private boolean checkAuthMode(ConnectionDetails connectionDetails) {
    MongoClient mongo = null;
    try {
      mongo = new MongoClient(connectionDetails.getHostIp(), connectionDetails.getHostPort());
      mongo.listDatabaseNames().iterator().next();
      return false;
    } catch (Exception e) {
      return true;
    } finally {
      if (mongo != null) {
        mongo.close();
        mongo = null;
      }
    }
  }

  private MongoClient getMongoAndAuthenticate(ConnectionDetails connectionDetails)
      throws ApplicationException {
    MongoClient mongo=null;
    boolean authModeUi;
    authModeUi=(connectionDetails.getUsername()==null || connectionDetails.getUsername().isEmpty())?false:true;
    if(!authModeUi) {
      mongo = new MongoClient(connectionDetails.getHostIp(), connectionDetails.getHostPort());
    }
    String dbNames = connectionDetails.getDbNames();
    String[] dbNamesList = dbNames.split(",");
    String username = connectionDetails.getUsername();
    String password = connectionDetails.getPassword();
    for (String dbName : dbNamesList) {
      dbName = dbName.trim();
      boolean loginStatus = false;
      try {
        if (authModeUi) {
          MongoCredential
              credential =
              MongoCredential.createCredential(username, dbName,
                                               password.toCharArray());
          mongo =
              new MongoClient(
                  new ServerAddress(connectionDetails.getHostIp(),
                                    connectionDetails.getHostPort()),
                  java.util.Arrays.asList(credential),
                  MongoClientOptions.builder().serverSelectionTimeout(1000).build());
          Iterator iterator = mongo.listDatabaseNames().iterator();
          while (iterator.hasNext()) {
            if (iterator.next().toString().equals(dbName)) {
              mongo.getDatabase(dbName).listCollections().iterator();
              loginStatus = true;
              break;
            }
          }
        } else {
          MongoDatabase db = mongo.getDatabase(dbName);
          db.listCollectionNames();
          loginStatus = true;
        }
        // Hack. Checking server connectivity status by fetching collection names on selected db
        // this line will throw exception in two cases.1)On Invalid mongo
        // host Address,2)Invalid authorization to fetch collection names

      }
      catch (MongoException me) {

        // loginStatus = db.authenticate(username, password.toCharArray());//login using given
        // username and password.This line will throw exception if invalid mongo host address
      }
      catch(Exception e)
      {

      }

      if (loginStatus) {
        connectionDetails.addToAuthenticatedDbNames(dbName);
      }
    }
    if (connectionDetails.getAuthenticatedDbNames().isEmpty()) {
      throw new ApplicationException(
          ("".equals(username) && "".equals(password))
              ? ErrorCodes.NEED_AUTHORISATION
              : ErrorCodes.INVALID_USERNAME,
          "Invalid UserName or Password");
    }
    return mongo;
  }

  @Override
  public MongoConnectionDetails getMongoConnectionDetails(String connectionId)
      throws ApplicationException {
    String[] split = connectionId.split("_");
    if (split.length != 2) {
      throw new ApplicationException(ErrorCodes.INVALID_CONNECTION, "Invalid Connection");
    }
    String connectionDetailsHashCode = String.valueOf(split[1]);
    Collection<MongoConnectionDetails> mongoConnectionDetailsList =
        allConnectionDetails.get(connectionDetailsHashCode);
    if (mongoConnectionDetailsList == null) {
      throw new ApplicationException(ErrorCodes.INVALID_CONNECTION, "Invalid Connection");
    }
    for (MongoConnectionDetails mongoConnectionDetails : mongoConnectionDetailsList) {
      if (connectionId.equals(mongoConnectionDetails.getConnectionId())) {
        return mongoConnectionDetails;
      }
    }
    throw new ApplicationException(ErrorCodes.INVALID_CONNECTION, "Invalid Connection");
  }

  @Override
  public MongoClient getMongoInstance(String connectionId) throws ApplicationException {
    String[] split = connectionId.split("_");
    if (split.length != 2) {
      throw new ApplicationException(ErrorCodes.INVALID_CONNECTION, "Invalid Connection");
    }
    String connectionDetailsHashCode = String.valueOf(split[1]);
    Collection<MongoConnectionDetails> mongoConnectionDetailsList =
        allConnectionDetails.get(connectionDetailsHashCode);
    if (mongoConnectionDetailsList == null) {
      throw new ApplicationException(ErrorCodes.INVALID_CONNECTION, "Invalid Connection");
    }
    for (MongoConnectionDetails mongoConnectionDetails : mongoConnectionDetailsList) {
      if (connectionId.equals(mongoConnectionDetails.getConnectionId())) {
        return mongoConnectionDetails.getMongo();
      }
    }
    throw new ApplicationException(ErrorCodes.INVALID_CONNECTION, "Invalid Connection");
  }

  @Override
  public void disconnectConnection(String connectionId) throws ApplicationException {
    String[] split = connectionId.split("_");
    if (split.length != 2) {
      throw new ApplicationException(ErrorCodes.INVALID_CONNECTION, "Invalid Connection");
    }
    String connectionDetailsHashCode = String.valueOf(split[1]);
    Collection<MongoConnectionDetails> mongoConnectionDetailsList =
        allConnectionDetails.get(connectionDetailsHashCode);
    if (mongoConnectionDetailsList == null) {
      throw new ApplicationException(ErrorCodes.INVALID_CONNECTION, "Invalid Connection");
    }
    Iterator<MongoConnectionDetails> mongoConnectionDetailsIterator =
        mongoConnectionDetailsList.iterator();
    while (mongoConnectionDetailsIterator.hasNext()) {
      MongoConnectionDetails mongoConnectionDetails = mongoConnectionDetailsIterator.next();
      if (connectionId.equals(mongoConnectionDetails.getConnectionId())) {
        mongoConnectionDetailsIterator.remove();
        return;
      }
    }
    throw new ApplicationException(ErrorCodes.INVALID_CONNECTION, "Invalid Connection");
  }

  private void sanitizeConnectionDetails(ConnectionDetails connectionDetails) {
    if ("localhost".equals(connectionDetails.getHostIp())) {
      connectionDetails.setHostIp("127.0.0.1");
    }
    String dbNames = connectionDetails.getDbNames();
    if (dbNames == null || dbNames.isEmpty()) {
      connectionDetails.setDbNames("admin");
    }
  }

  public static AuthService getInstance() {
    return Auth_SERVICE;
  }
}
