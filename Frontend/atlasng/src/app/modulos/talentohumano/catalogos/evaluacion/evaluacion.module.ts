import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionRoutingModule } from './evaluacion.routing';

import { EvaluacionComponent } from './componentes/evaluacion.component';
import { ParamgestionpuestoModule } from './submodulos/paramgestionpuesto/paramgestionpuesto.module';
import { ConocimientoModule } from './submodulos/conocimiento/conocimiento.module';
import { ComptecnicasModule } from './submodulos/comptecnicas/comptecnicas.module';
import { CompuniversalesModule } from './submodulos/compuniversales/compuniversales.module';
import { TrabajoequipoModule } from './submodulos/trabajoequipo/trabajoequipo.module';

import { CabeceraModule } from './submodulos/cabecera/cabecera.module';


import { LovPlantillaEvaluacionMrlModule } from './../../lov/plantillaevaluacionmrl/lov.plantillaevaluacionmrl.module';
import { LovPlantillaModule } from './../../lov/plantilla/lov.plantillaevaluacionmrl.module';



@NgModule({
  imports: [SharedModule, EvaluacionRoutingModule, ParamgestionpuestoModule, ComptecnicasModule, ConocimientoModule, LovPlantillaEvaluacionMrlModule, CompuniversalesModule, TrabajoequipoModule, CabeceraModule,LovPlantillaModule],
  declarations: [EvaluacionComponent]
})
export class EvaluacionModule { }
