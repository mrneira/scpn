import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DesembolsoRoutingModule } from './_desembolso.routing';
import { DesembolsoComponent } from './componentes/_desembolso.component';

@NgModule({
  imports: [SharedModule, DesembolsoRoutingModule],
  declarations: [DesembolsoComponent],
  exports: [DesembolsoComponent]
})
export class DesembolsoModule { }
