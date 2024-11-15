import { SoloFechaPipe } from './../pipe/solofecha.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  InputTextModule, MenuModule,ButtonModule, MessagesModule, InputMaskModule, DataTableModule, DialogModule, FieldsetModule,
  PanelModule, DropdownModule, CheckboxModule, RadioButtonModule, TabViewModule, AccordionModule, CalendarModule, FileUploadModule
} from 'primeng/primeng';


import { MayusculasDirective } from '../directivas/mayusculas.directive';
import { EnteroDirective } from '../directivas/entero.directive';
import { FocoDirective } from '../directivas/foco.directive';
import { NumeroDirective } from '../directivas/numero/numero.directive';
import { NumeroPositivoDirective } from '../directivas/numero/numeroPositivo.directive';
import { NumeroDecimal4Directive } from '../directivas/numero/numeroDecimal4.directive';
import { NumeroDecimal7Directive } from '../directivas/numero/numeroDecimal7.directive';
import { NumeroDecimal10Directive } from '../directivas/numero/numeroDecimal10.directive';
import { NumeroDecimal11Directive } from '../directivas/numero/numeroDecimal11.directive';
import { NumeroDecimal15Directive } from '../directivas/numero/numeroDecimal15.directive';
import { NumeroDecimal16Directive } from '../directivas/numero/numeroDecimal16.directive';
import { NumeroDecimal22Directive } from '../directivas/numero/numeroDecimal22.directive';
import { NumeroDecimalCoordDirective } from '../directivas/numero/numeroDecimalCoord.directive';
import { EnteroGuionDirective } from '../directivas/enteroGuion.directive';
import { LetrasDirective } from '../directivas/letras.directive';
import { FechaEnteroPipe } from '../pipe/fechaentero.pipe';
import { EnteroFechaFormatoPipe } from '../pipe/fechaenteroformato';
import { EnteroFechaFormatoYYMMPipe } from '../pipe/fechaenteroformatoYYMM';
import { DocumentoDirective } from '../directivas/documento.directive';
import { HoraDirective } from '../directivas/hora.directive';
import { NumeroDocumentoDirective } from '../directivas/numerodocumento.directive';
import { EmailDirective } from '../directivas/email.directive';


@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [MayusculasDirective, EnteroDirective, FocoDirective, NumeroDirective,EnteroFechaFormatoPipe, EnteroFechaFormatoYYMMPipe, FechaEnteroPipe, 
    LetrasDirective, NumeroPositivoDirective, NumeroDecimal10Directive, NumeroDecimal11Directive, NumeroDecimal16Directive, NumeroDecimal15Directive, NumeroDecimal4Directive, NumeroDecimal7Directive, NumeroDecimalCoordDirective, EnteroGuionDirective,SoloFechaPipe, DocumentoDirective,
    HoraDirective,NumeroDocumentoDirective, EmailDirective
    ],
  exports: [MayusculasDirective, EnteroDirective, FocoDirective, NumeroDirective, FechaEnteroPipe,EnteroFechaFormatoPipe, EnteroFechaFormatoYYMMPipe,
     LetrasDirective, NumeroPositivoDirective, NumeroDecimal10Directive, NumeroDecimal11Directive, NumeroDecimal16Directive, NumeroDecimal15Directive, NumeroDecimal4Directive, NumeroDecimal7Directive, NumeroDecimalCoordDirective, EnteroGuionDirective, DocumentoDirective, 
    CommonModule, FormsModule, InputTextModule, MenuModule, ButtonModule, MessagesModule, InputMaskModule, DataTableModule, DialogModule,
    FieldsetModule, PanelModule, DropdownModule, CheckboxModule, RadioButtonModule, TabViewModule, AccordionModule, CalendarModule, FileUploadModule,SoloFechaPipe,HoraDirective,NumeroDocumentoDirective,EmailDirective]
})
export class BasicModule { }
