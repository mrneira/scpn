import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import {JubilacionRoutingModule } from './jubilacion.routing';
import { JubilacionComponent } from './componentes/jubilacion.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import { LovNominaModule } from '../../lov/nomina/lov.nomina.module';

import {DatosgeneralesModule} from './submodulos/datosgenerales/datosgenerales.module';
import {DetalleModule} from './submodulos/detalle/detalle.module';
import {IngresoModule} from './submodulos/ingreso/ingreso.module';
import {EgresoModule} from './submodulos/egreso/egreso.module';


@NgModule({
  imports: [SharedModule, JubilacionRoutingModule,
    LovFuncionariosModule,DatosgeneralesModule,DetalleModule,IngresoModule,EgresoModule,LovNominaModule],
  declarations: [JubilacionComponent]
})
export class JubilacionModule { }
