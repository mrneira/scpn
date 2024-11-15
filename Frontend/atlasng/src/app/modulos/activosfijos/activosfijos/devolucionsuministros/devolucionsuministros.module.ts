import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DevolucionSuministrosRoutingModule } from './devolucionsuministros.routing';
import { DevolucionSuministrosComponent } from './componentes/devolucionsuministros.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';
import { LovEgresosModule } from '../../lov/egresos/lov.egresos.module';

@NgModule({
  imports: [SharedModule, DevolucionSuministrosRoutingModule, CabeceraModule, DetalleModule, JasperModule,
            LovFuncionariosModule, LovEgresosModule],
  declarations: [DevolucionSuministrosComponent]
})
export class DevolucionSuministrosModule { }
