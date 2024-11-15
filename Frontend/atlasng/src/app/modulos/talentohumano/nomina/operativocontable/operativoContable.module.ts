import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OperativoContableRoutingModule } from './operativoContable.routing';
import { OperativoContableComponent } from './componentes/operativoContable.component';

@NgModule({
  imports: [SharedModule, OperativoContableRoutingModule],
  declarations: [OperativoContableComponent]
})
export class OperativoContableModule { }
