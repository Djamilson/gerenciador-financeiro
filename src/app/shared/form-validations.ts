import { FormArray, FormControl, FormGroup, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import bcrypt from 'bcryptjs';

import * as moment from 'moment';

export class FormValidations {

  static requiredMinCheckbox(min = 1) {
    const validator = (formArray: FormArray) => {
            const totalChecked = formArray.controls
        .map(v => v.value)
        .reduce((total, current) => current ? total + current : total, 0);
      return totalChecked >= min ? null : { required: true };
    };
    return validator;
  }

  static cepValidator(control: FormControl) {

    const cep = control.value;
    if (cep && cep !== '') {
      const validacep = /^[0-9]{8}$/;
      return validacep.test(cep) ? null : { cepInvalido : true };
    }
    return null;
  }


  static comparaSenha(otherField: string) {

    const validator = (formControl: FormControl) => {
    //  if (!codigo) {

      if (otherField == null) {
        throw new Error('É necessário informar um campo.');
      }

      if (!formControl.root || !(<FormGroup>formControl.root).controls) {
        return null;
      }

      const field = (<FormGroup>formControl.root).get(otherField);

      if (!field) {
        throw new Error('É necessário informar um campo válido.');
      }

      if (field.value !== formControl.value) {
        return { equalsTo : otherField };
      }

      return null;
    };

    return validator;
  }



  static equalsTo(otherField: string) {

    const validator = (formControl: FormControl) => {

      if (otherField == null) {
        throw new Error('É necessário informar um campo.');
      }

      if (!formControl.root || !(<FormGroup>formControl.root).controls) {
        return null;
      }

      const field = (<FormGroup>formControl.root).get(otherField);

      if (!field) {
        throw new Error('É necessário informar um campo válido.');
      }

      if (field.value !== formControl.value) {
        return { equalsTo : otherField };
      }

      return null;
    };

    return validator;
  }

  static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any) {
    const config = {
      'required': `${fieldName} é obrigatório!`,
      'minlength': `${fieldName} precisa ter no mínimo ${validatorValue.requiredLength} caracteres!`,
      'maxlength': `${fieldName} precisa ter no máximo ${validatorValue.requiredLength} caracteres!`,
      'cepInvalido': 'CEP inválido!',
      'emailInvalido': 'Email já cadastrado!',
      'equalsTo': `O campo ${fieldName} está diferente do campo de Email!`,
      'NoPassswordMatch': `O campo ${fieldName} está diferente do campo de Senha!`,
      'pattern': `${fieldName} precisa ter no mínimo ${validatorValue.hasSmallCase} caracteres!`,
      'hasNumber': `${fieldName} deve ter no mínimo  1 número!`,
      'hasCapitalCase': `${fieldName} deve ter no mínimo 1 Letra Maiúscula!`,
      'hasSmallCase': `${fieldName} deve ter no mínimo 1 Letra Minúscula!`,
      'hasSpecialCharacters': `${fieldName} deve ter no mínimo 1 caractere especial!`

    };

    return config[validatorName];
  }

  static passwordMatchValidator(control: AbstractControl) {
    const senha: string = control.get('senha').value; // get password from our password form control
    const confirmaSenha: string = control.get('confirmaSenha').value; // get password from our confirmPassword form control
    // compare is the password math
    if (senha !== confirmaSenha) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmaSenha').setErrors({ NoPassswordMatch: true });
    }
  }

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }


    static MatchPassword(AC: AbstractControl) {
       const senha = AC.get('senha').value; // to get value in input tag
       const confirmaSenha = AC.get('confirmaSenha').value; // to get value in input tag

        if ( senha !== confirmaSenha) {
          //  console.log('false');
            AC.get('confirmaSenha').setErrors( {MatchPassword: true} );
            throw new Error('Senha são diferentes!');

            // this.messageService.add({ severity: 'error', detail: msg.concat(objetoJaEstaCadastrado) });

        } else {
          //  console.log('true');
            AC.get('confirmaSenha').setErrors( {MatchPassword: false} );

          //  return null;
        }

    }

// criptografa senha
     static hapshPassword(password: string, rounds: number, callback: Function) {
      return bcrypt.hash(password, rounds, (error, hash) => {
         return callback(error, hash);
      });
  }


static generateHashPassword(password: string, salt: number): Promise<any> {
  return new Promise<any>((accept, reject) => {

      bcrypt.hash(password, salt, (error, hash) => {
          if (error) {
              reject(error);
          } else {
            console.log(hash);
              accept(hash);
          }
      });
  });
}

static hashPassword_o_( password: string, salt: number): Promise<any> {
  console.log('pesquisa password =>> ', password);

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            reject(err);
        } else {
          console.log(hash);
            resolve(hash);
        }
    });
});




}



    static equalControlValue(targetKey: string, toMatchKey: string): ValidatorFn {

      return (group: FormGroup): { [key: string]: any } => {

        const target = group.controls[ targetKey ];
        const toMatch = group.controls[ toMatchKey ];
        if (target.touched && toMatch.touched) {

          const isMatch = target.value === toMatch.value;

          // set equal value error on dirty controls
          if (!isMatch && target.valid && toMatch.valid) {
            toMatch.setErrors({ equalValue: targetKey });
            const message = targetKey + ' diferente de ' + toMatchKey;
            return { 'equalValue': message };
          }

          if (isMatch && toMatch.hasError('equalControlValue')) {
            toMatch.setErrors(null);
          }
        }

        return null;
      };
    }




    static validarObrigatoriedade(input: AbstractControl) {
      return (input.value ? null : { obrigatoriedade: true });
    }

    static validarTamanhoMinimo(valor: number) {
      return (input: AbstractControl) => {
        return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
      };
    }


    static format(date) {
      if (date !== null) {
        return moment(date).format('DD/MM/YYYY');
       }
      }

    static getFormattedPrice(price: number) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    }
    static getTestaData(date) {

      if (moment(date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
      return 'bg-danger text-white ';
      } else if (moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
        return 'bg-info text-white';
      }
    }

}
