var privileges;

function setRolesAndPrivileges(privs) {
  privileges = privs;
}

function hasPrivilege(privilege,collection,db) {
  var privs;
  if (typeof(privileges) != 'undefined'){
      privs = privileges.inheritedPrivileges.filter(function(eachPriv){
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

  if (typeof(privileges) != 'undefined'){
    return actions && actions.length > 0;
  }
  else
  {
    return true;
  }
}

function hasRole(role,db){
  var rols;
  if(typeof(privileges) != 'undefined'){
       rols = privileges.roles.filter(function(eachRole){
       return eachRole.db == db;   
     }); 
  }
  else{
    return true;
  }


  var roles;
  if (rols && rols.length > 0 ){
    roles = rols.filter(function(eachRole){
      return eachRole.role == role;
    });
  }
  
  return roles && roles.length > 0
}

var privilegesAPI = {
  setRoles: setRolesAndPrivileges,
  hasPrivilege: hasPrivilege,
  hasRole: hasRole
}

export default privilegesAPI;