import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OperativoContableRoutingModule } from './operativoContable.routing';
import { OperativoContableComponent } from './componentes/operativoContable.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, OperativoContableRoutingModule, JasperModule],
  declarations: [OperativoContableComponent]
})
export class OperativoContableModule { }
