import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { PagoInstitucionesRoutingModule } from './pagoInstituciones.routing';

import { PagoInstitucionesComponent } from './componentes/pagoInstituciones.component';

import { LovPersonasModule } from '../../../../personas/lov/personas/lov.personas.module';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, PagoInstitucionesRoutingModule, LovPersonasModule, JasperModule ],
  declarations: [PagoInstitucionesComponent],
  exports: [PagoInstitucionesComponent]
})
export class PagoInstucionesModule { }
