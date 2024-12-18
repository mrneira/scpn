import { InputService } from "./input.service";

export class InputHandler {

    private inputService: InputService;
    private onModelChange: Function;
    private onModelTouched: Function;

    constructor(htmlInputElement: HTMLInputElement, options: any) {
        this.inputService = new InputService(htmlInputElement, options);
    }

    handleClick(event: any): void {
        this.inputService.resetSelection();
    }

    handleCut(event: any): void {
        setTimeout(() => {
            this.inputService.updateFieldValue();
            this.onModelChange(this.inputService.value);
        }, 1);
    }

    handleInput(event: any): void {
        let keyCode = this.inputService.rawValue.charCodeAt(this.inputService.rawValue.length - 1);
        let rawValueLength = this.inputService.rawValue.length;
        let rawValueSelectionStart = this.inputService.inputSelection.selectionStart;
        let storedRawValueLength = this.inputService.storedRawValue.length;
        this.inputService.rawValue = this.inputService.storedRawValue;

        if (rawValueLength !== rawValueSelectionStart || Math.abs(rawValueLength - storedRawValueLength) !== 1) {
            return;
        }

        if (rawValueLength < storedRawValueLength) {
            this.inputService.removeNumber(8);
        }

        if (rawValueLength > storedRawValueLength) {
            switch (keyCode) {
                case 43:
                    this.inputService.changeToPositive();
                    break;
                case 45:
                    this.inputService.changeToNegative();
                    break;
                default:
                    if (!this.inputService.canInputMoreNumbers) {
                        return;
                    }

                    this.inputService.addNumber(keyCode);
            }
        }

        this.onModelChange(this.inputService.value);
    }

    handleKeydown(event: any): void {
        let keyCode = event.which || event.charCode || event.keyCode;

        if (keyCode === undefined) {
            return;
        }

        if (keyCode === 8 || keyCode === 46 || keyCode === 63272) {
            event.preventDefault();
            this.inputService.removeNumber(keyCode);
            this.onModelChange(this.inputService.value);
        }
    }

    handleKeydownspace(event: any): void {
        let keyCode = event.which || event.charCode || event.keyCode;

        if (keyCode === undefined) {
            return;
        }

        if (keyCode === 8 || keyCode === 46 || keyCode === 63272) {
            event.preventDefault();
            this.onModelChange(this.inputService.value);
        }
    }

    handleKeypress(event: any): void {
        let keyCode = event.which || event.charCode || event.keyCode;

        switch (keyCode) {
            case undefined:
                return;
            case 43:
                this.inputService.changeToPositive();
                break;
            case 45:
                this.inputService.changeToNegative();
                break;
            default:
                if (!this.inputService.canInputMoreNumbers) {
                    return;
                }

                this.inputService.addNumber(keyCode);
        }

        event.preventDefault();
        this.onModelChange(this.inputService.value);
    }

    handlePaste(event: any): void {
        setTimeout(() => {
            this.inputService.updateFieldValue();
            this.onModelChange(this.inputService.value);
        }, 1);
    }

    updateOptions(options: any): void {
        this.inputService.updateOptions(options);
    }

    getOnModelChange(): Function {
        return this.onModelChange;
    }

    setOnModelChange(callbackFunction: Function): void {
        this.onModelChange = callbackFunction;
    }

    getOnModelTouched(): Function {
        return this.onModelTouched;
    }

    setOnModelTouched(callbackFunction: Function) {
        this.onModelTouched = callbackFunction;
    }

    setValue(value: number): void {
        this.inputService.value = value;
    }
}