import { ValidationErrors } from '@admin/models/base';
import intersection from 'lodash/intersection';
import keys from 'lodash/keys';
import map from 'lodash/map';

type ValidationErrorMessages = Record<string, string>;

const useValidationError = (defaultErrors: ValidationErrorMessages) => {
    const validationErrorMessages = ref({ ...defaultErrors });

    const reset = () => {
        validationErrorMessages.value = { ...defaultErrors };
    };

    const assign = (validationErrors: ValidationErrors) => {
        const intersectedKeys = intersection(
            keys(validationErrors),
            keys(validationErrorMessages.value),
        );
        const newErrors: ValidationErrorMessages = {};
        map(intersectedKeys, (key) => {
            newErrors[key] = validationErrors[key].join('\n');
        });

        validationErrorMessages.value = {
            ...validationErrorMessages.value,
            ...newErrors,
        };
    };

    return {
        validationErrorMessages,
        reset,
        assign,
    };
};

export default useValidationError;
