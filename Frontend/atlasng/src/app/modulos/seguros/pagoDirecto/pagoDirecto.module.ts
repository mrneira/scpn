import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { PagoDirectoRoutingModule } from './pagoDirecto.routing';
import { PagoDirectoComponent } from './componentes/pagoDirecto.component';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../personas/lov/personavista/lov.personaVista.module';
import { LovSegurosModule } from '../lov/seguros/lov.seguros.module';
import { DatosPolizaModule } from './submodulos/datosPoliza/_datosPoliza.module'

@NgModule({
  imports: [SharedModule, PagoDirectoRoutingModule, LovPersonasModule, LovPersonaVistaModule, LovSegurosModule, DatosPolizaModule],
  declarations: [PagoDirectoComponent]
})
export class PagoDirectoModule { }
