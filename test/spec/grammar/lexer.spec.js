/**
 * Copyright 2013-2020 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-new, no-unused-expressions */
const { expect } = require('chai');
const { JDLLexer } = require('../../../lib/dsl/lexer/lexer');

describe('JDLLexer', () => {
  context('when passing a valid JDL input', () => {
    let lexingResult;

    before(() => {
      const input = `
   entity JobHistory {
     startDate ZonedDateTime,
     endDate ZonedDateTime,
     language Language,
     positionDuration Duration
   }`;
      lexingResult = JDLLexer.tokenize(input);
    });

    it('should not fail', () => {
      expect(lexingResult.errors).to.be.empty;
    });

    it('should lex a simple valid JDL text', () => {
      const tokens = lexingResult.tokens;
      expect(tokens.length).to.equal(15);
      expect(tokens[0].image).to.equal('entity');
      expect(tokens[1].image).to.equal('JobHistory');
      expect(tokens[2].image).to.equal('{');
      expect(tokens[3].image).to.equal('startDate');
      expect(tokens[4].image).to.equal('ZonedDateTime');
      expect(tokens[5].image).to.equal(',');
      expect(tokens[6].image).to.equal('endDate');
      expect(tokens[7].image).to.equal('ZonedDateTime');
      expect(tokens[8].image).to.equal(',');
      expect(tokens[9].image).to.equal('language');
      expect(tokens[10].image).to.equal('Language');
      expect(tokens[11].image).to.equal(',');
      expect(tokens[12].image).to.equal('positionDuration');
      expect(tokens[13].image).to.equal('Duration');
      expect(tokens[14].image).to.equal('}');
    });
  });

  context('when passing an invalid JDL input', () => {
    let lexingResult;

    before(() => {
      const input = `
   entity JobHistory {
     startDate ZonedDateTime,
     ###
     endDate ZonedDateTime
   }`;
      lexingResult = JDLLexer.tokenize(input);
    });

    it('should report the errors', () => {
      const errors = lexingResult.errors;
      expect(errors).to.have.lengthOf(1);
      expect(errors[0].line).to.equal(4);
      expect(errors[0].column).to.equal(6);
      expect(errors[0].message).to.include('#');
      expect(errors[0].message).to.include('skipped 3 characters');
    });

    it('should lex a simple invalid JDL text', () => {
      expect(lexingResult.tokens).to.have.lengthOf(
        9,
        'All 9 tokens should have been lexed even though "@@@" caused a syntax error'
      );
    });
  });

  context('when passing a entity security', () => {
    let lexingResult = null;

    before(() => {
      const input = `
   entity JobHistory {
     startDate ZonedDateTime,
     endDate ZonedDateTime,
     language Language
   }
   secure JobHistory with roles {
     admin allows get,post,put,delete 
     user allows get     
      }
   secure JobHistory with customSecurity {
     admin allows get,post,put,delete 
     user allows get     
      }      
            
   `;
      lexingResult = JDLLexer.tokenize(input);
    });

    it('does not fail', () => {
      expect(lexingResult.errors).to.be.empty;
    });

    it('can lex a simple valid JDL text', () => {
      const tokens = lexingResult.tokens;
      expect(tokens.length).to.equal(48);
      expect(tokens[0].image).to.equal('entity');
      expect(tokens[1].image).to.equal('JobHistory');
      expect(tokens[2].image).to.equal('{');
      expect(tokens[3].image).to.equal('startDate');
      expect(tokens[4].image).to.equal('ZonedDateTime');
      expect(tokens[5].image).to.equal(',');
      expect(tokens[6].image).to.equal('endDate');
      expect(tokens[7].image).to.equal('ZonedDateTime');
      expect(tokens[8].image).to.equal(',');
      expect(tokens[9].image).to.equal('language');
      expect(tokens[10].image).to.equal('Language');
      expect(tokens[11].image).to.equal('}');
      expect(tokens[12].image).to.equal('secure');
      expect(tokens[12].tokenType.name).to.equal('SECURE');
      expect(tokens[13].image).to.equal('JobHistory');
      expect(tokens[13].tokenType.name).to.equal('NAME');
      expect(tokens[14].image).to.equal('with');
      expect(tokens[14].tokenType.name).to.equal('WITH');
      expect(tokens[15].image).to.equal('roles');
      expect(tokens[15].tokenType.name).to.equal('ROLES');
      expect(tokens[16].image).to.equal('{');
      expect(tokens[17].image).to.equal('admin');
      expect(tokens[17].tokenType.name).to.equal('NAME');
      expect(tokens[18].image).to.equal('allows');
      expect(tokens[18].tokenType.name).to.equal('ALLOWS');
      expect(tokens[19].image).to.equal('get');
      expect(tokens[19].tokenType.name).to.equal('NAME');
      expect(tokens[20].image).to.equal(',');
      expect(tokens[21].image).to.equal('post');
      expect(tokens[21].tokenType.name).to.equal('NAME');
      expect(tokens[22].image).to.equal(',');
      expect(tokens[23].image).to.equal('put');
      expect(tokens[23].tokenType.name).to.equal('NAME');
      expect(tokens[24].image).to.equal(',');
      expect(tokens[25].image).to.equal('delete');
      expect(tokens[25].tokenType.name).to.equal('NAME');
      expect(tokens[26].image).to.equal('user');
      expect(tokens[26].tokenType.name).to.equal('NAME');
      expect(tokens[27].image).to.equal('allows');
      expect(tokens[27].tokenType.name).to.equal('ALLOWS');
      expect(tokens[28].image).to.equal('get');
      expect(tokens[28].tokenType.name).to.equal('NAME');
      expect(tokens[29].image).to.equal('}');
    });
  });
});
