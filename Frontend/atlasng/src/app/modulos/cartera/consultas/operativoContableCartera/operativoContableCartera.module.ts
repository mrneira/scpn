import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OperativoContableCarteraRoutingModule } from './operativoContableCartera.routing';
import { OperativoContableCarteraComponent } from './componentes/operativoContableCartera.component';
import { DetalleOperativoCarteraComponent } from './componentes/_detalleOperativoCartera.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, OperativoContableCarteraRoutingModule, JasperModule],
  declarations: [OperativoContableCarteraComponent, DetalleOperativoCarteraComponent]
})
export class OperativoContableCarteraModule { }
