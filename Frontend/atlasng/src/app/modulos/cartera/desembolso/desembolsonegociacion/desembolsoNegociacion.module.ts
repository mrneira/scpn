import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DesembolsoNegociacionRoutingModule } from './desembolsoNegociacion.routing';
import { DesembolsoNegociacionComponent } from './componentes/desembolsoNegociacion.component';

@NgModule({
  imports: [SharedModule, DesembolsoNegociacionRoutingModule],
  declarations: [DesembolsoNegociacionComponent]
})
export class DesembolsoNegociacionModule { }
