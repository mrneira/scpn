import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { RecepcionSeguroRoutingModule } from './recepcionSeguro.routing';

import { RecepcionSeguroComponent } from './componentes/recepcionSeguro.component';

import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovSegurosModule } from '../lov/seguros/lov.seguros.module';
import { DatosOperacionModule } from './submodulos/datosOperacion/_datosOperacion.module'
import { DatosGarantiaModule } from './submodulos/datosGarantia/_datosGarantia.module'

@NgModule({
  imports: [SharedModule, RecepcionSeguroRoutingModule, LovPersonasModule, LovSegurosModule, DatosOperacionModule, DatosGarantiaModule],
  declarations: [RecepcionSeguroComponent]
})
export class RecepcionSeguroModule { }
