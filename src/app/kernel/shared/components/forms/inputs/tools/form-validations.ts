
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BarcodeService } from '../../../../services/barcode.service';

export class FormValidations {

    constructor( ) { }

    static minSelector(min){
        const validator = (formArray: FormArray) => {
            if(formArray.value.length < min){
                //console.log('minCheck')
                return { minCheck: true, val: min }
            }
            return null
        }
        return validator;
    }

    static requiredMinCheckbox(min){
        const validator = (formArray: FormArray) => {
            const totalChecked = formArray.controls.map(v => v.value).reduce((total, current) => current ? total + current : total, 0);
            return totalChecked >= min ? null : { minCheck: true, val: min };
        };
        return validator;
    }

    static requiredMaxCheckbox(max){
        const validator = (formArray: FormArray) => {
            const totalChecked = formArray.controls.map(v => v.value).reduce((total, current) => current ? total + current : total, 0);
            return totalChecked <= max ? null : { maxCheck: true, val: max };
        };
        return validator;
    }

    static cepValidator(control: FormControl){
        const cep = control.value;
        if(cep && cep !== ''){
            const cepValidate = /^[0-9]{8}$/;
            return cepValidate.test(cep) ? null : { invalidCEP: true };
        }
        return null;
    }

    static equalsTo(otherField: string){
        const validator = (formControl: FormControl) => {

            const field = (<FormGroup>formControl.root.get(otherField));

            if(formControl.value != '' && formControl.value != null){
                if(otherField == null){
                    throw new Error('É necessário informar um field.');
                }
                if(!formControl.root || !(<FormGroup>formControl.root).controls){
                    return null;
                }
                if(!field){
                    throw new Error('É necessário informar um field válido.');
                }
                if(field.value !== formControl.value){
                    return { equalsTo : otherField }
                }
                return null;
            }
            return null;
        };
        return validator;
    }

    static passwordRequirement(action: string){
        const validator = (formControl: FormControl) => {
            if(action == 'new'){
                //console.log(formControl.value)
                if(formControl.value != '' && formControl.value != null){
                    return null;
                }
                return { required : true }
            }
        }
        return validator;
    }

    static imageRequirement(action: string){
        const validator = (formControl: FormControl) => {
            if(action == 'new'){
                if(formControl.value != null){
                    return null;
                }
                return { required : true }
            }
        }
        return validator;
    }

    static cpfValidator(control:FormControl){

        if(control.value != null){
            //Declaração das Variáveis
            let num1, num2, num3, num4, num5, num6, num7, num8, num9, num10, num11, soma1, soma2, resto1, resto2: number;

            //Extraindo os Dígitos informados
            num1 = control.value.substr(0, 1);
            num2 = control.value.substr(1, 1);
            num3 = control.value.substr(2, 1);
            num4 = control.value.substr(3, 1);
            num5 = control.value.substr(4, 1);
            num6 = control.value.substr(5, 1);
            num7 = control.value.substr(6, 1);
            num8 = control.value.substr(7, 1);
            num9 = control.value.substr(8, 1);
            num10 = control.value.substr(9, 1);
            num11 = control.value.substr(10, 1);

            //Validando CPFs inválidos conhecidos
            if((num1 == num2) && (num2 == num3) && (num3 == num4) && (num4 == num5) && (num5 == num6) && (num6 == num7) && (num7 == num8) && (num8 == num9) && (num9 == num10) && (num10 == num11)){
                return {invalidCPF: true}
            }else{

                soma1 = num1 * 10 + num2 * 9 + num3 * 8 + num4 * 7 + num5 * 6 + num6 * 5 + num7 * 4 + num8 * 3 + num9 * 2;

                resto1 = (soma1 * 10) % 11;

                if(resto1 == 10){
                    resto1 = 0;
                }

                soma2 = num1 * 11 + num2 * 10 + num3 * 9 + num4 * 8 + num5 * 7 + num6 * 6 + num7 * 5 + num8 * 4 + num9 * 3 + num10 * 2;

                resto2 = (soma2 * 10) % 11;

                if(resto2 == 10){
                    resto2 = 0;
                }

                if(( resto1 == num10) && (resto2 == num11)){
                    return null;
                }else{
                    return {invalidCPF: true}
                }
            }
        }

    }

    static genderValidation(control: FormControl){
        if(control.value == null){
            return {required: true}
        }
        const gender = control.value;
    }

    static validateBarcode(control: FormControl){
      const serv = new BarcodeService();

      if(!serv.validate('ean13', "", control.value)){
          return { barcode: true }
      }
    }

    static dateInFutureValidator(control: FormControl){
      const date = control.value;
      if(date != null){
        let now = new Date()

        if(now >= date){
          return { dateInFuture: true }
        }
      }
    }

    static getErrorMsg(field: string, validationName: string, validationValue?: any, validationQtd?: any){

        //console.log("FIELD: ", field, "VALUE", validationValue)

        const config = {
            'email' : `Campo ${field} inválido.`,
            'equalsTo' : `Campo ${field} deve ser igual.`,
            'required' : `Campo ${field} é obrigatório.`,
            'min' : `Campo ${field} deve ser no mínimo ${validationValue.min}`,
            'minlength' : `Campo ${field} precisa ter no mínimo ${validationValue.requiredLength} caracteres.`,
            'maxlength' : `Campo ${field} precisa ter no máximo ${validationValue.requiredLength} caracteres.`,
            'minCheck' : `Campo ${field} necessita selecionar ao menos ${validationQtd}.`,
            'maxCheck' : `Campo ${field} não pode selecionar mais que ${validationQtd}.`,
            'dataAgendamento': `Não é possível agendar uma aula com data inferior à atual`,
            'invalidEmail' : `Campo ${field} já cadastrado.`,
            'invalidCPF': `Campo ${field} inválido.`,
            'invalidRenach': `${field} deve ser composto somente de números até 9 digitos.`,
            'barcode': 'Código de barras inválido',
            'dateInFuture': `${field} não pode ser inferior à data/hora atual.`
        }

        return config[validationName];
    }

}
