import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { CedulaPresupuestariaGastosComponent } from './componentes/cedulaPresupuestariaGastos.component';
import { CedulaPresupuestariaGastosRoutingModule } from './cedulaPresupuestariaGastos.routing';

@NgModule({
  imports: [SharedModule, CedulaPresupuestariaGastosRoutingModule, JasperModule],
  declarations: [CedulaPresupuestariaGastosComponent]
})
export class CedulaPresupuestariaGastosModule { }
