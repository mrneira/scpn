import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { EspecialRoutingModule } from './_especial.routing';
import { EspecialComponent } from './componentes/_especial.component';

@NgModule({
  imports: [SharedModule, EspecialRoutingModule],
  declarations: [EspecialComponent],
  exports: [EspecialComponent]

})
export class EspecialModule { }
