import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovEvaluacionmetaRoutingModule } from './lov.evaluacionmeta.routing';
import { LovEvaluacionMetaComponent } from './componentes/lov.evaluacionmeta.component';

@NgModule({
  imports: [SharedModule, LovEvaluacionmetaRoutingModule],
  declarations: [LovEvaluacionMetaComponent],
  exports: [LovEvaluacionMetaComponent]
})
export class LovEvaluacionmetaModule { }

