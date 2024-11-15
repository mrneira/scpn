import { InputManager } from "./input.manager";

export class InputService {

    private inputManager: InputManager;

    constructor(private htmlInputElement: any, private options: any) {
        this.inputManager = new InputManager(htmlInputElement);
    }

    addNumber(keyCode: number): void {
        let keyChar = String.fromCharCode(keyCode);
        let selectionStart = this.inputSelection.selectionStart;
        let selectionEnd = this.inputSelection.selectionEnd;
        this.rawValue = this.rawValue.substring(0, selectionStart) + keyChar + this.rawValue.substring(selectionEnd, this.rawValue.length);
        this.updateFieldValue(selectionStart + 1);
    }

    public applyMask(isNumber: boolean, rawValue: string): string {
        let { allowNegative, precision, thousands, decimal } = this.options;
        rawValue = isNumber ? new Number(rawValue).toFixed(precision) : rawValue;
        let onlyNumbers = rawValue.replace(/[^0-9]/g, "");
        let integerPart;
        let decimalPart;
        let newRawValue;
        let numberPart = rawValue.split(decimal);
        if (new Number(rawValue).toFixed(precision)) {
            integerPart = numberPart[0].replace(thousands, "").replace(thousands, "").replace(thousands, "").replace(thousands, "").replace(thousands, "").replace(thousands, "").replace(thousands, "").replace(thousands, "").replace(thousands, "").replace(thousands, "").replace(thousands, "").replace(thousands, "").replace(thousands, "").replace(thousands, "");
            integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
            if (integerPart == "") {
                integerPart = "";
            }
            newRawValue = integerPart;
            decimalPart = onlyNumbers.slice(onlyNumbers.length - precision);

            if (numberPart.length > 1 && rawValue.match(decimal)) {
                newRawValue += decimal + numberPart[1].substring(0, precision);
            }
            if (rawValue == "NaN") {
                newRawValue = "";
            }
        }
        else {
            return onlyNumbers;
        }
        let isZero = parseInt(integerPart) == 0 && (parseInt(decimalPart) == 0 || decimalPart == "");
        let operator = (rawValue.indexOf("-") > -1 && allowNegative && !isZero) ? "-" : "";
        return operator + this.options.prefix + newRawValue;
    }

    clearMask(rawValue: string): number {
        let value = (rawValue || "0").replace(this.options.prefix, "");

        if (this.options.thousands) {
            value = value.replace(new RegExp("\\" + this.options.thousands, "g"), "");
        }

        if (this.options.decimal) {
            value = value.replace(this.options.decimal, ".");
        }

        return parseFloat(value);
    }

    changeToNegative(): void {
        if (this.options.allowNegative && this.rawValue !== "" && this.rawValue.charAt(0) !== "-" && this.value !== 0) {
            this.rawValue = "-" + this.rawValue;
        }
    }

    changeToPositive(): void {
        this.rawValue = this.rawValue.replace("-", "");
    }

    removeNumber(keyCode: number): void {
        let selectionStart = this.inputSelection.selectionStart;
        let selectionEnd = this.inputSelection.selectionEnd;

        if (selectionStart == selectionEnd) {
            if (keyCode === 8) {
                let lastNumber = this.rawValue.split("").reverse().join("").search(/\d/);
                selectionStart = 0;
                selectionEnd = this.rawValue.length - 1;
            } else {
                selectionEnd += 1;
            }
        }

        this.rawValue = this.rawValue.substring(selectionStart, selectionEnd);
        this.updateFieldValue(selectionEnd);
    }

    resetSelection(): void {
        if (this.htmlInputElement.setSelectionRange) {
            if (this.rawValue === "0.00") {
                this.htmlInputElement.select(this.rawValue.length, this.rawValue.length); // this.rawValue = "";
            }
            else {
                this.htmlInputElement.setSelectionRange(this.rawValue.length, this.rawValue.length);
            }
        }
    }

    updateFieldValue(selectionStart?: number): void {
        if (isNaN(parseFloat(this.rawValue))) { this.rawValue = ""; }
        let newRawValue = this.applyMask(false, this.rawValue || "");
        selectionStart = selectionStart == undefined ? this.rawValue.length : selectionStart;
        this.inputManager.updateValueAndCursor(newRawValue, this.rawValue.length, selectionStart);
    }

    updateOptions(options: any): void {
        let value: number = this.value;
        this.options = options;
        this.value = value;
    }

    get canInputMoreNumbers(): boolean {
        return this.inputManager.canInputMoreNumbers;
    }

    get inputSelection(): any {
        return this.inputManager.inputSelection;
    }

    get rawValue(): string {
        return this.inputManager.rawValue;
    }

    set rawValue(value: string) {
        this.inputManager.rawValue = value;
    }

    get storedRawValue(): string {
        return this.inputManager.storedRawValue;
    }

    get value(): number {
        return this.clearMask(this.rawValue);
    }

    set value(value: number) {
        this.rawValue = this.applyMask(true, "" + value);
    }
}