import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionRoutingModule } from './evaluacion.routing';
import { EvaluacionComponent } from './componentes/evaluacion.component';

//Submodulos
import { ParamgestionpuestoModule } from './submodulos/paramgestionpuesto/paramgestionpuesto.module';
import { ConocimientoModule } from './submodulos/conocimiento/conocimiento.module';
import { ComptecnicasModule } from './submodulos/comptecnicas/comptecnicas.module';
import { CompuniversalesModule } from './submodulos/compuniversales/compuniversales.module';

import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
//import {SidebarModule} from 'primeng/primeng';

//lov
import { LovPeriodoModule } from '../../lov/periodo/lov.periodo.module';
import { LovEvaluacionModule } from '../../lov/evaluacion/lov.evaluacion.module';
import {LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';
import {LovPlantillaEvaluacionMrlModule} from '../../lov/plantillaevaluacionmrl/lov.plantillaevaluacionmrl.module'

import {LovFuncionariosEvaluadosModule} from '../../lov/evaluados/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, EvaluacionRoutingModule,ParamgestionpuestoModule,ComptecnicasModule,
    ConocimientoModule,LovPeriodoModule,LovEvaluacionModule,LovFuncionariosModule,
    CompuniversalesModule,LovPlantillaEvaluacionMrlModule,CabeceraModule,LovFuncionariosEvaluadosModule],
  declarations: [EvaluacionComponent]
})
export class EvaluacionModule { }
