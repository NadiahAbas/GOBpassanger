import { FormControl } from '@angular/forms';

export function ageValidator(ctrl: FormControl): any {
    if (ctrl.value === null || ctrl.value === undefined) {
        return {
            "required": true
        };
    }

    if (!(ctrl.value instanceof Date)) {
        return {
            "invalidDate": true
        };
    }

    var now = new Date();
    var earlier13 = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
    
    if (ctrl.value > earlier13) {
        return {
            "minAge": true
        };
    }
}