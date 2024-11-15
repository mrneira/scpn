import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ImpresionDocumentosRoutingModule } from './impresionDocumentos.routing';

import { ImpresionDocumentosComponent } from './componentes/impresionDocumentos.component';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';
import { LovTransaccionesModule } from '../../../generales/lov/transacciones/lov.transacciones.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, ImpresionDocumentosRoutingModule, LovPersonasModule, LovOperacionCarteraModule, JasperModule],
  declarations: [ImpresionDocumentosComponent]
})
export class ImpresionDocumentosModule { }
