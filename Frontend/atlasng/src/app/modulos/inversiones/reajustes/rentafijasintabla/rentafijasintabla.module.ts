import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RentafijasintablaRoutingModule } from './rentafijasintabla.routing';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';

import { LovComentariosModule } from '../../../inversiones/lov/comentarios/lov.comentarios.module';

import { RentafijasintablaComponent } from './componentes/rentafijasintabla.component';
import { InstrumentoModule } from './submodulos/instrumento/instrumento.module';
import { SbsModule } from './submodulos/sbs/sbs.module';
import { TablamortizacionModule } from './submodulos/tablamortizacion/tablamortizacion.module';
import { TirModule } from './submodulos/tir/tir.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, RentafijasintablaRoutingModule, LovInversionesModule, JasperModule,
    TablamortizacionModule, 
    SbsModule, LovComentariosModule,
    InstrumentoModule, 
    TirModule],
  declarations: [RentafijasintablaComponent],
  exports: []
})
export class RentafijasintablaModule { }
