import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import {NominaRoutingModule } from './nomina.routing';
import { NominaComponent } from './componentes/nomina.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import { LovNominaModule } from '../../lov/nomina/lov.nomina.module';

import {DatosgeneralesModule} from './submodulos/datosgenerales/datosgenerales.module';
import {RolPagoModule} from './submodulos/rolpago/rolpago.module';
import {IngresoModule} from './submodulos/ingreso/ingreso.module';
import {EgresoModule} from './submodulos/egreso/egreso.module';


@NgModule({
  imports: [SharedModule, NominaRoutingModule,
    LovFuncionariosModule,DatosgeneralesModule,RolPagoModule,IngresoModule,EgresoModule,LovNominaModule],
  declarations: [NominaComponent]
})
export class NominaModule { }
