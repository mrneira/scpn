import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import {LiquidacionRoutingModule } from './liquidacion.routing';
import { LiquidacionComponent } from './componentes/liquidacion.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import { LovNominaModule } from '../../lov/nomina/lov.nomina.module';

import {DatosgeneralesModule} from './submodulos/datosgenerales/datosgenerales.module';
import {DetalleModule} from './submodulos/detalle/detalle.module';
import {IngresoModule} from './submodulos/ingreso/ingreso.module';
import {EgresoModule} from './submodulos/egreso/egreso.module';


@NgModule({
  imports: [SharedModule, LiquidacionRoutingModule,
    LovFuncionariosModule,DatosgeneralesModule,DetalleModule,IngresoModule,EgresoModule,LovNominaModule],
  declarations: [LiquidacionComponent]
})
export class LiquidacionModule { }
