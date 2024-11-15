import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OperativoContableGarantiasRoutingModule } from './operativoContableGarantias.routing';
import { OperativoContableGarantiasComponent } from './componentes/operativoContableGarantias.component';

@NgModule({
  imports: [SharedModule, OperativoContableGarantiasRoutingModule],
  declarations: [OperativoContableGarantiasComponent]
})
export class OperativoContableGarantiasModule { }
