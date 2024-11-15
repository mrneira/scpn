import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionRoutingModule } from './evaluacion.routing';
import { EvaluacionComponent } from './componentes/evaluacion.component';

//Submodulos
import { MetaDetalleModule } from './submodulos/metadetalle/metadetalle.module';

import { CabeceraModule } from './submodulos/cabecera/cabecera.module';


//lov
import { LovPeriodoModule } from '../../lov/periodo/lov.periodo.module';

import { LovEvaluacionmetaModule } from '../../lov/evaluacionmeta/lov.evaluacionmeta.module'


@NgModule({
  imports: [SharedModule, EvaluacionRoutingModule,
    LovPeriodoModule,CabeceraModule,LovEvaluacionmetaModule,MetaDetalleModule],
  declarations: [EvaluacionComponent]
})
export class EvaluacionModule { }
