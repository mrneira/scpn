import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { RubrosOperacionRoutingModule } from './_rubrosOperacion.routing';
import { RubrosOperacionComponent } from './componentes/_rubrosOperacion.component';

@NgModule({
  imports: [SharedModule, RubrosOperacionRoutingModule],
  declarations: [RubrosOperacionComponent],
  exports: [RubrosOperacionComponent]
})
export class RubrosOperacionModule { }
