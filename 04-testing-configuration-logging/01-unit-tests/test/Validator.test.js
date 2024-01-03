const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({ age: 5 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 5');
    });

    it('валидатор возвращает ошибки для всех полей', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 10, 
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      const errors = validator.validate({ name: 10, age: 'La' });

      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
    });

    it('валидатор возвращает ошибки максимального значения для каждого из типов', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 10, 
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      const errors = validator.validate({ name: 'Lalalalalal', age: 28 });

      expect(errors).to.have.length(2);

      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 10, got 11');

      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too big, expect 27, got 28');
    });

    it('валидатор не возвращает ошибки', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 10, 
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      const errors = validator.validate({ name: 'Lalal', age: 18 });

      expect(errors).to.have.length(0);
    });
  });
});