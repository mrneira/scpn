import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ValidacionespecialRoutingModule } from './validacionespecial.routing';

import { ValidacionespecialComponent } from './componentes/validacionespecial.component';


@NgModule({
  imports: [SharedModule, ValidacionespecialRoutingModule ],
  declarations: [ValidacionespecialComponent]
})
export class ValidacionespecialModule { }
