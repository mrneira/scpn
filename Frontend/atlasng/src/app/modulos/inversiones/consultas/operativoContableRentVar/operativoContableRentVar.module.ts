import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OperativoContableRentVarRoutingModule } from './operativoContableRentVar.routing';
import { OperativoContableRentVarComponent } from './componentes/operativoContableRentVar.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, OperativoContableRentVarRoutingModule, JasperModule],
  declarations: [OperativoContableRentVarComponent]
})
export class OperativoContableRentVarModule { }
