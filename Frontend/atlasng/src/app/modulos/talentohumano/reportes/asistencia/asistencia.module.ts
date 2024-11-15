import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AsistenciaRoutingModule } from './asistencia.routing';
import { AsistenciaComponent } from './componentes/asistencia.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, AsistenciaRoutingModule, JasperModule, LovFuncionariosModule ],
  declarations: [AsistenciaComponent]
})
export class AsistenciaModule { }
