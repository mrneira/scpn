import {Pipe, PipeTransform} from '@angular/core';
/*
 * Convierte un long en milisegundos a fecha en formato string
 * Usage:
 *   value | fechaentero
 * Example:
 *   {{ fecha |  fechaentero}}
*/
@Pipe({name: 'SoloFechaPipe'})
export class SoloFechaPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) {
      return '';
    }
    const fecha = new Date(value);
    const s = fecha.toISOString();
    const d = s.substr(0, 10);
    return d;
  }
}
