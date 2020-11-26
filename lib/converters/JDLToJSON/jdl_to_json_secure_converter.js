module.exports = {
  convert
};

/**
 * Converts secure clause to JSON content,
 * @param jdlObject  - the JDL object containing entities, fields and enums.
 * @returns {Map<String, Array<Object>>} a map having for keys an entity's name and for values its JSON secure clause.
 */
function convert(jdlObject) {
  if (!jdlObject) {
    throw new Error('A JDL Object must be passed to convert JDL security to JSON.');
  }
  const convertedSecureClauses = new Map();

  jdlObject.forEachEntity(jdlEntity => {
    const convertedSecure = getConvertedSecureForEntity(jdlEntity);
    convertedSecureClauses.set(jdlEntity.name, convertedSecure);
  });

  return convertedSecureClauses;
}

function getConvertedSecureForEntity(jdlEntity) {
  const secure = {
    securityType: 'none'
  };

  if (jdlEntity.secure) {
    secure.securityType = jdlEntity.secure.securityType;
    if (secure.securityType === 'roles') {
      secure.roles = [...jdlEntity.secure.roles];
    } else if (secure.securityType === 'privileges') {
      secure.privileges = [...jdlEntity.secure.privileges];
    } else if (secure.securityType === 'parentPrivileges') {
      secure.parentPrivileges = jdlEntity.secure.parentPrivileges;
    } else if (secure.securityType === 'relPrivileges') {
      secure.relPrivileges = jdlEntity.secure.relPrivileges;
    } else {
      secure.customSecurity = [...jdlEntity.secure.customSecurity];
    }
  }
  return secure;
}
