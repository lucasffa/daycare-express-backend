// src/validators/cpf.validator.ts
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { isValidCpf } from '../utils/cpf.util';

@ValidatorConstraint({ async: false })
export class IsCpfValidConstraint implements ValidatorConstraintInterface {
    validate(cpf: string, args: ValidationArguments) {
        const cleanCpf = cpf.replace(/[^\d]+/g, "");
        if (cleanCpf.length !== 11) {
            return false;
        }

        return isValidCpf(cpf);
    }

    defaultMessage(args: ValidationArguments) {
        const cpf = args.value;
        const cleanCpf = cpf.replace(/[^\d]+/g, "");

        if (cleanCpf.length !== 11) {
            return 'CPF must have 11 digits';
        }

        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(cpf)) {
            return 'CPF must be in the format XXX.XXX.XXX-XX';
        }

        return 'CPF has an invalid check digit';
    }
}

export function IsCpfValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCpfValidConstraint,
        });
    };
}