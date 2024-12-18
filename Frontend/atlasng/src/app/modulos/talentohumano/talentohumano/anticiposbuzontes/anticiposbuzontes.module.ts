import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovDesignacionesModule } from '../../lov/designaciones/lov.designaciones.module';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import { LovCargoModule } from '../../lov/cargo/lov.cargo.module';
import { LovDepartamentosModule } from '../../lov/departamentos/lov.departamentos.module';
import { LovGrupoOcupacionalModule } from '../../lov/grupoocupacional/lov.grupoocupacional.module';
import { LovHorarioModule } from '../../lov/horario/lov.horario.module';
import { LovTipoVinculacionModule } from '../../lov/tipovinculacion/lov.tipovinculacion.module';
import { LovTipoRelacionLaboralModule } from '../../lov/tiporelacionlaboral/lov.tiporelacionlaboral.module';
import { EditorModule } from 'primeng/primeng';
import { JasperModule } from '.././../../../util/componentes/jasper/jasper.module';
import { LovPartidaGastoModule } from'../../../presupuesto/lov/partidagasto/lov.partidagasto.module';
import { AnticiposbuzontesRoutingModule } from './anticiposbuzontes.routing';
import { AnticiposbuzontesComponent } from './componentes/anticiposbuzontes.component';

@NgModule({
  imports: [SharedModule, AnticiposbuzontesRoutingModule, EditorModule, LovDesignacionesModule, LovCargoModule, LovDepartamentosModule,
    LovFuncionariosModule, LovGrupoOcupacionalModule, LovPartidaGastoModule,LovHorarioModule, LovTipoRelacionLaboralModule, JasperModule,LovTipoVinculacionModule],
  declarations: [AnticiposbuzontesComponent],
  exports: []
})
export class AnticiposbuzontesModule { }
