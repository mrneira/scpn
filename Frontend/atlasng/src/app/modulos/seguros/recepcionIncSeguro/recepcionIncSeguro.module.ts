import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { RecepcionIncSeguroRoutingModule } from './recepcionIncSeguro.routing';

import { RecepcionIncSeguroComponent } from './componentes/recepcionIncSeguro.component';

import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovSegurosModule } from '../lov/seguros/lov.seguros.module';
import { DatosOperacionModule } from './submodulos/datosOperacion/_datosOperacion.module'
import { DatosGarantiaModule } from './submodulos/datosGarantia/_datosGarantia.module'

@NgModule({
  imports: [SharedModule, RecepcionIncSeguroRoutingModule, LovPersonasModule, LovSegurosModule, DatosOperacionModule, DatosGarantiaModule],
  declarations: [RecepcionIncSeguroComponent]
})
export class RecepcionIncSeguroModule { }
