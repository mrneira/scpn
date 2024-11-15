import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CapacitacionRoutingModule } from './capacitacion.routing';

import { CapacitacionComponent } from './componentes/capacitacion.component';

import{LovCapacitacionModule} from '../../lov/capacitacion/lov.capacitacion.module';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import {CapacitacionEventoModule} from './submodulos/cabecera/capacitacioncab.module';
import {CapacitacionDetalleModule} from './submodulos/detalle/capacitaciondet.module';

@NgModule({
  imports: [SharedModule, CapacitacionRoutingModule, LovCapacitacionModule,LovFuncionariosModule,CapacitacionDetalleModule,CapacitacionEventoModule],
  declarations: [CapacitacionComponent]
})
export class CapacitacionModule { }
