import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { IngresoPolizaRoutingModule } from './ingresoPoliza.routing';

import { IngresoPolizaComponent } from './componentes/ingresoPoliza.component';

import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovSegurosModule } from '../lov/seguros/lov.seguros.module';
import { DatosPolizaModule } from './submodulos/datosPoliza/_datosPoliza.module'

@NgModule({
  imports: [SharedModule, IngresoPolizaRoutingModule, LovPersonasModule, LovSegurosModule, DatosPolizaModule],
  declarations: [IngresoPolizaComponent]
})
export class IngresoPolizaModule { }
