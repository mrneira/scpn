import { NgModule } from '@angular/core';
import { LovDesignacionesModule } from '../../lov/designaciones/lov.designaciones.module';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import { LovCargoModule } from '../../lov/cargo/lov.cargo.module';
import { LovDepartamentosModule } from '../../lov/departamentos/lov.departamentos.module';
import { LovGrupoOcupacionalModule } from '../../lov/grupoocupacional/lov.grupoocupacional.module';
import { LovHorarioModule } from '../../lov/horario/lov.horario.module';
import { LovTipoVinculacionModule } from '../../lov/tipovinculacion/lov.tipovinculacion.module';
import { LovTipoRelacionLaboralModule } from '../../lov/tiporelacionlaboral/lov.tiporelacionlaboral.module';
import { EditorModule, SpinnerModule } from 'primeng/primeng';
import { LovPartidaGastoModule } from'../../../presupuesto/lov/partidagasto/lov.partidagasto.module';
import { AnticiposComponent } from './componentes/anticipos.component';
import { SharedModule } from '../../../../util/shared/shared.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { AnticiposRoutingModule } from './anticipos.routing';

@NgModule({
  imports: [SharedModule, AnticiposRoutingModule, EditorModule, SpinnerModule,
    LovFuncionariosModule, LovGrupoOcupacionalModule,LovHorarioModule, LovTipoRelacionLaboralModule, JasperModule,LovTipoVinculacionModule],
  declarations: [AnticiposComponent],
  exports: []
})
export class AnticiposModule { }
