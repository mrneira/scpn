import { Pipe, PipeTransform } from '@angular/core';
/*
 * Convierte un numero YYYYMMDD a fecha en formato string YYYY-MM-DD
 * Usage:
 *   value | fechaenteroformato
 * Example:
 *   {{ fecha |  fechaenteroformato}}
*/
@Pipe({name: 'fechaenteroformato'})
export class EnteroFechaFormatoPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) {
      return '';
    }
    const valueaux=value+"";
    const anio =valueaux.substring(0,4);
    const mes =valueaux.substring(4,6);
    let dia =valueaux.substring(6);
    if(dia == ''){
      dia = '01';
    }
    const fechaSinformato= anio+"-"+mes+"-"+dia;

    return fechaSinformato;
  }
}
