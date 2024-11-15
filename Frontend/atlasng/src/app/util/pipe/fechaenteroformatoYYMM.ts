import { Pipe, PipeTransform } from '@angular/core';
/*
 * Convierte un numero YYYYMMDD a fecha en formato string YYYY-MM-DD
 * Usage:
 *   value | fechaenteroformatoYYMM
 * Example:
 *   {{ fecha |  fechaenteroformatoYYMM}}
*/
@Pipe({name: 'fechaenteroformatoYYMM'})
export class EnteroFechaFormatoYYMMPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) {
      return '';
    }
    const valueaux=value+"";
    const anio =valueaux.substring(0,4);
    const mes =valueaux.substring(4,6);
       const fechaSinformato= anio+"-"+mes;

    return fechaSinformato;
  }
}
