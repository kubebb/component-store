import { decodeBase64 } from '@/common/utils';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'passwordValite', async: false })
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(value: string, validationArguments?: ValidationArguments): boolean {
    const psw = decodeURIComponent(decodeBase64(value));
    const [min, max, pattern] = validationArguments.constraints;
    return psw.length > min && psw.length < max && (!pattern || pattern.test(psw));
  }
}
