import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform, ValidationError, ValidationPipeOptions } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

/*
    errors: {
        "title": [
            "title should not be empty"
        ],
        "description": [
            "description should not be empty"
        ]
    }
    */
export interface ValidationErrorResponse {
    errors: {
        [type: string]: string[];
    }
}

@Injectable()
export class MediumValidationPipe implements PipeTransform {
    
    constructor(validationOptions?: ValidationPipeOptions){
        validationOptions && (this._validationOptions = validationOptions);
    }

    private _validationOptions: ValidationPipeOptions = {};

    async transform(value: any, metadata: ArgumentMetadata) {
        const object = plainToClass(metadata.metatype, value);
        
        if(typeof object !== 'object') {
            return value;
        }

        const errors = await validate(object, this._validationOptions);
        
        if(errors.length === 0) {
            return value;
        }

        throw new HttpException(this.formatErrors(errors), HttpStatus.UNPROCESSABLE_ENTITY);
    }

    formatErrors(errors: ValidationError[]): ValidationErrorResponse {
        return {
            errors: errors.reduce((acc, error)=>{
                acc[error.property] = Object.values(error.constraints);
                return acc;
            },{}),
        };
    }
}