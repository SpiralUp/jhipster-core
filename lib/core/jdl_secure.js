const { merge } = require('../utils/object_utils');

// secure: {
//   securityType: 'roles',
//     roles: [
//     {
//       role: 'ROLE_ADMIN',
//       actionList: ['GET', 'PUT', 'POST', 'DELETE']
//     },
//     {
//       role: 'ROLE_USER',
//       actionList: ['GET']
//     }
//   ]
// }

// let parentPrivileges = { parent: null, field: null };
// let relPrivileges = { fromEntity: null, fromField: null, toEntity: null, toField: null };

// privileges
// { action, privList }

class JDLSecure {
  constructor(args) {
    const merged = merge(defaults(), args);
    if (!merged.securityType) {
      throw new Error('The security type is mandatory to create a secure definition.');
    }
    this.securityType = merged.securityType;
    // this.comment = merged.comment;
    if (this.securityType === 'roles') {
      this.roles = [...merged.roles];
    } else if (this.securityType === 'privileges') {
      this.privileges = [...merged.privileges];
    } else if (this.securityType === 'parentPrivileges') {
      this.parentPrivileges = merged.parentPrivileges;
    } else if (this.securityType === 'relPrivileges') {
      this.relPrivileges = merged.relPrivileges;
    } else {
      this.customSecurity = [...merged.customSecurity];
    }
  }

  toString() {
    let string = '';
    if (this.comment) {
      string += `/**\n${this.comment
        .split('\n')
        .map(line => ` * ${line}\n`)
        .join('')} */\n`;
    }
    string += `${this.securityType}`;
    if (this.securityType === 'roles') {
      this.roles.forEach(item => {
        string += ` ${item.role} (`;
        item.actionList.forEach(action => {
          string += ` ${action}`;
        });
        string += ')';
      });
    } else if (this.securityType === 'privileges') {
      this.privileges.forEach(item => {
        string += ` ${item.action} (`;
        item.privList.forEach(priv => {
          string += ` ${priv}`;
        });
        string += ')';
      });
    } else if (this.securityType === 'parentPrivileges') {
      string += ` ${this.parentPrivileges.parent} ${this.parentPrivileges.field}`;
    } else if (this.securityType === 'relPrivileges') {
      string += ` ${this.relPrivileges.fromEntity} ${this.relPrivileges.fromField} ${this.relPrivileges.toEntity} ${this.relPrivileges.toField}`;
    }
    return string;
  }
}

module.exports = JDLSecure;

function defaults() {
  return {
    securityType: 'roles',
    roles: [],
    privileges: [],
    parentPrivileges: { parent: null, field: null },

    relPrivileges: { fromEntity: null, fromField: null, toEntity: null, toField: null },
    customSecurity: []
  };
}
