import { NgModule, Directive, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../util/shared/componentes/base.component';
import { Router } from '@angular/router';
import { DtoServicios } from '../../util/servicios/dto.servicios';
@Directive({
    selector: '[ngModel][documento]',
    host: {
        "(focusout)": 'focusout($event)'
    }
})
export class DocumentoDirective extends BaseComponent {
    @Input() tipodocumento: any;
    @Input() mensaje: string = 'EL DOCUMENTO INGRESADO PRESENTA ERRORES';
    private static ModuloRuc: number = 11;
    private static CoeficienteRuc9Privada: any = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    private static CoeficienteRuc6Publica: any = [3, 2, 7, 6, 5, 4, 3, 2];

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'DIRECTIVADOCUMENTO', 'DIRECTIVADOCUMENTO', false);
        this.componentehijo = this;
    }

    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    value: string;

    focusout($event: any) {
        super.encerarMensajes();

        if (!DocumentoDirective.verificarDocumento(this.tipodocumento, $event.target.value))
            super.mostrarMensajeError(this.mensaje);
    }

    public static verificarDocumento(tipodocumento: string, documento: string): boolean {
        var flag = true;
        switch (tipodocumento) {
            case 'C':
                flag = DocumentoDirective.verificarCedula(documento);
                break;
            case 'R':
                flag = DocumentoDirective.validarRuc(documento);
                break;
            case undefined:
                flag = false;
                break;
            case null:
                flag = false;
                break;
        }
        return flag;
    }

    public static verificarCedula(cedula: any): boolean {
        if (typeof (cedula) == 'string' && cedula.length == 10 && /^\d+$/.test(cedula)) {
            var digitos = cedula.split('').map(Number);
            var codigo_provincia = digitos[0] * 10 + digitos[1];

            //if (codigo_provincia >= 1 && (codigo_provincia <= 24 || codigo_provincia == 30) && digitos[2] < 6) {

            if (codigo_provincia >= 1 && (codigo_provincia <= 24 || codigo_provincia == 30)) {
                var digito_verificador = digitos.pop();

                var digito_calculado = digitos.reduce(
                    function (valorPrevio, valorActual, indice) {
                        return valorPrevio - (valorActual * (2 - indice % 2)) % 9 - (valorActual == 9 ? 1 : 0) * 9;
                    }, 1000) % 10;
                return digito_calculado === digito_verificador;
            }
        }
        return false;
    }

    public static AplicarDigitoVerificadorRuc(identificacion: string): boolean {

        var entidadPublica = false;
        if (identificacion == null)
            return false;

        if (identificacion.length != 13)
            return false;

        var identificacionNumerica = parseFloat(identificacion);

        if (isNaN(identificacionNumerica))
            return false;

        //Descomponer los primeros 9 caracteres numéricos
        var descomponer: any[] = identificacion.substring(0, 9).split("");

        //No puede existir una provincia mayor a 25
        if (parseInt(identificacion.substring(0, 2)) > 26)
            return false;

        //La posición 2 no puede ser diferente de 7 y 8
        if (descomponer[2] == '7' || descomponer[2] == '8')
            return false;

        //Entidades Públicas
        if (descomponer[2] == '6')
            entidadPublica = true;

        var digitoValidadorIdentificacion: string = identificacion.substring(9, 10);

        var sum = 0;
        if (entidadPublica) {
            if (identificacion.substring(10, 13) !== "001")
                return false;

            // Si es entida pública el dígito verificador está en la posición 9
            digitoValidadorIdentificacion = identificacion.substring(8, 9);
            var contador = 0;

            this.CoeficienteRuc6Publica.forEach(numeroCoeficiente => {
                var multiplicacion = parseFloat(descomponer[contador].toString()) * numeroCoeficiente;
                sum += multiplicacion;
                contador++;
            });
        }
        else {
            var contador = 0;

            this.CoeficienteRuc9Privada.forEach(numeroCoeficiente => {
                var multiplicacion = parseFloat(descomponer[contador].toString()) * numeroCoeficiente;
                sum += multiplicacion;
                contador++;
            });
        }

        var digitoVerificador = sum % this.ModuloRuc;

        if (digitoVerificador != 0)
            digitoVerificador = this.ModuloRuc - digitoVerificador;

        if (digitoVerificador == parseInt(digitoValidadorIdentificacion))
            return true;

        return false;
    }

    public static validarRuc(identificacion: string): boolean {
        var flag = false;
        if (typeof (identificacion) == 'string' && identificacion.length == 13 && /^\d+$/.test(identificacion)) {
            var digitos = identificacion.split('').map(Number);
            var codigo_provincia = digitos[0] * 10 + digitos[1];
            var inst_publica;
            var tipo_modulo;
            var coeficientes;
            if ((codigo_provincia >= 1 && codigo_provincia <= 24) || codigo_provincia == 30) {
                if (digitos[2] != 7 || digitos[2] != 8) {
                    tipo_modulo = (digitos[2] > 5) ? 11 : 10;
                    if (digitos[2] == 6) {
                        digitos = digitos.slice(0, 9);
                        inst_publica = true;
                        coeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
                    } else {
                        digitos = digitos.slice(0, 10);
                        inst_publica = false;
                        coeficientes = (digitos[2] == 9) ? [4, 3, 2, 7, 6, 5, 4, 3, 2] : [2, 1, 2, 1, 2, 1, 2, 1, 2];
                    }

                    var digito_verificador = digitos.pop();
                    var digito_calculado = tipo_modulo - digitos.reduce(function (valorPrevio, valorActual, indice) {
                        var resultado = valorActual * coeficientes[indice]; if (digitos[2] < 6) {
                            resultado = (resultado > 9) ? resultado - 9 : resultado;
                        }
                        return valorPrevio + resultado;
                    }, 0) % tipo_modulo;
                    digito_calculado = (digito_calculado === 11) ? 0 : digito_calculado;
                    if (digito_calculado === digito_verificador) {
                        flag = true;
                    }

                    var ult =  parseInt(identificacion.substring(10, 13));
                    if(inst_publica && ult>1){
                     flag = false;   
                    }

                    if(!inst_publica && ult>3){
                       flag = false;
                    }
                }
            }
        }
        return flag;
    }
}