import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation Utils', () => {
  describe('StringValidation', () => {
    it('receivesNotEmptyStringExpectedReturnTrue', () => {
      expect(Validation.isRequired('Some text')).to.be.true;
    });

    it('receivesEmptyStringExpectedReturnFalse', () => {
      expect(Validation.isRequired('   ')).to.be.false;
      expect(Validation.isRequired('')).to.be.false;
    });
  });

  describe('isUserIdValid', () => {
    it('receivesOnlyNumbersExpectedReturnTrue', () => {
      expect(Validation.isUserIdValid('123456')).to.be.true;
    });

    it('receivesNotOnlyNumbersExpectedReturnFalse', () => {
      expect(Validation.isUserIdValid('123a45')).to.be.false;
    });
  });

  describe('isYearValid', () => {
    it('receivesValidYearExpectedReturnTrue', () => {
      expect(Validation.isYearValid('2023')).to.be.true;
    });

    it('receivesInvalidYearExpectedReturnFalse', () => {
      const nextYear = (new Date().getFullYear() + 1).toString();
      expect(Validation.isYearValid(nextYear)).to.be.false;
    });

    it('receivesInvalidYearFormatExpectedReturnFalse', () => {
      expect(Validation.isYearValid('99')).to.be.false;
      expect(Validation.isYearValid('20k3')).to.be.false;
    });
  });
});
