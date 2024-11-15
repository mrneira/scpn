import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RentavariableRoutingModule } from './rentavariable.routing';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';

import { RentavariableComponent } from './componentes/rentavariable.component';
import { InstrumentoModule } from './submodulos/instrumento/instrumento.module';

import { InversiondetalleModule } from './submodulos/inversiondetalle/inversiondetalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, RentavariableRoutingModule, LovInversionesModule, JasperModule,

    InstrumentoModule,
    InversiondetalleModule],
  declarations: [RentavariableComponent],
  exports: []
})
export class RentavariableModule { }
