var privileges;

function setRolesAndPrivileges(privs) {
  privileges = privs;
}

function hasPrivilege(privilege,collection,db) {
  var privs = privileges.inheritedPrivileges.filter(function(eachPriv){
    return eachPriv.resource.collection == collection && eachPriv.resource.db == db;
  });

  if (privs.length == 0) {
    privs = privileges.inheritedPrivileges.filter(function(eachPriv){
      return eachPriv.resource.collection == "" && eachPriv.resource.db == db;
    });
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