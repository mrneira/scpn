import {Pipe, PipeTransform} from '@angular/core';
/*
 * Convierte un long en milisegundos a fecha en formato string
 * Usage:
 *   value | fechaentero
 * Example:
 *   {{ fecha |  fechaentero:'date'}}
 *   {{ fecha |  fechaentero:'datetime'}}
*/
@Pipe({name: 'fechaentero'})
export class FechaEnteroPipe implements PipeTransform {
  transform(value: number, tipofecha = 'datetime'): string {
    if (value == null) {
      return '';
    }
    const fecha = new Date(value);
    const s = fecha.toLocaleString('es');
    const sarray = s.split(' ');
    const darray = sarray[0].split('/');
    const t = sarray[1];

    if (tipofecha === 'date') {
      return darray[2] + '-' + (darray[1].length === 1 ? ('0' + darray[1]) : darray[1]) + '-' + (darray[0].length === 1 ? ('0' + darray[0]) : darray[0]);
    }
    if (tipofecha === 'datetime') {
      return darray[2] + '-' + (darray[1].length === 1 ? ('0' + darray[1]) : darray[1]) + '-' + (darray[0].length === 1 ? ('0' + darray[0]) : darray[0]) + ' ' + t;
    }
    return s;
  }
}
