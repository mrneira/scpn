import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { EgresosRoutingModule } from './_egresos.routing';
import { EgresosComponent } from './componentes/_egresos.component';

@NgModule({
  imports: [SharedModule, EgresosRoutingModule ],
  declarations: [EgresosComponent],
  exports: [EgresosComponent]
})
export class EgresosModule { }
