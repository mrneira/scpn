import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DocumentosBIRoutingModule } from './documentosBI.routing';

import { DocumentosBIComponent } from './componentes/documentosBI.component';

import { LovTransaccionesModule } from '../../../generales/lov/transacciones/lov.transacciones.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, DocumentosBIRoutingModule, JasperModule],
  declarations: [DocumentosBIComponent]
})
export class DocumentosBIModule { }
