import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { RenovacionPolizaIncrementoRoutingModule } from './renovacionPolizaIncremento.routing';
import { RenovacionPolizaIncrementoComponent } from './componentes/renovacionPolizaIncremento.component';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../personas/lov/personavista/lov.personaVista.module';
import { LovSegurosModule } from '../lov/seguros/lov.seguros.module';
import { DatosPolizaModule } from './submodulos/datosPoliza/_datosPoliza.module'

@NgModule({
  imports: [SharedModule, RenovacionPolizaIncrementoRoutingModule, LovPersonasModule, LovPersonaVistaModule, LovSegurosModule, DatosPolizaModule],
  declarations: [RenovacionPolizaIncrementoComponent]
})
export class RenovacionPolizaIncrementoModule { }
