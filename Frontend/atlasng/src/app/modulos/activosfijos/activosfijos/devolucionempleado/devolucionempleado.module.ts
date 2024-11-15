import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DevolucionEmpleadoRoutingModule } from './devolucionempleado.routing';
import { DevolucionEmpleadoComponent } from './componentes/devolucionempleado.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, DevolucionEmpleadoRoutingModule, CabeceraModule, DetalleModule, JasperModule,
            LovFuncionariosModule],
  declarations: [DevolucionEmpleadoComponent]
})
export class DevolucionEmpleadoModule { }
