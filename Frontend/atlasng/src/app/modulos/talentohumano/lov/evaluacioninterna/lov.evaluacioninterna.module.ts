import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovEvaluacionInternaRoutingModule } from './lov.evaluacioninterna.routing';
import { LovEvaluacionInternaComponent } from './componentes/lov.evaluacioninterna.component';

@NgModule({
  imports: [SharedModule, LovEvaluacionInternaRoutingModule],
  declarations: [LovEvaluacionInternaComponent],
  exports: [LovEvaluacionInternaComponent]
})
export class LovEvaluacionInternaModule { }

