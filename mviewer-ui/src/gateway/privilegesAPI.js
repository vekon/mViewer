var privileges;

function setRolesAndPrivileges(privs) {
  privileges = privs;
}

function hasPrivilege(privilege,collection,db) {
  if (typeof(privileges) != 'undefined'){
    var privs = privileges.inheritedPrivileges.filter(function(eachPriv){
      return eachPriv.resource.collection == collection && eachPriv.resource.db == db;
    });
  }
  else{
    return true;
  }

  if (typeof(privileges) != 'undefined'){
    if (privs.length == 0) {
      privs = privileges.inheritedPrivileges.filter(function(eachPriv){
        return eachPriv.resource.collection == "" && eachPriv.resource.db == db;
      });
    }
  }
  else {
    return true;
  }

  var actions;
  if (privs && privs.length > 0) {
    actions = privs[0].actions.filter(function(eachAction){
      return eachAction == privilege;
    });
  }

  return actions && actions.length > 0;
}

var privilegesAPI = {
  setRoles: setRolesAndPrivileges,
  hasPrivilege: hasPrivilege
}

export default privilegesAPI;