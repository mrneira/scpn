import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import {DecimoRoutingModule } from './decimos.routing';
import { DecimoComponent } from './componentes/decimos.component';
import { LovFuncionariosModule } from '../../../lov/funcionarios/lov.funcionarios.module';
import { LovNominaModule } from '../../../lov/nomina/lov.nomina.module';

import {DatosgeneralesModule} from './submodulos/datosgenerales/datosgenerales.module';
import {DetalleModule} from './submodulos/detalle/detalle.module';


@NgModule({
  imports: [SharedModule, DecimoRoutingModule,
    LovFuncionariosModule,DatosgeneralesModule,DetalleModule,LovNominaModule],
  declarations: [DecimoComponent]
})
export class DecimoModule { }
