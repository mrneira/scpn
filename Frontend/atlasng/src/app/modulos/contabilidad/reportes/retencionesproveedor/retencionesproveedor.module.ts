import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RetencionesproveedorRoutingModule } from './retencionesproveedor.routing';

import { RetencionesproveedorComponent } from './componentes/retencionesproveedor.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, RetencionesproveedorRoutingModule, JasperModule],
  declarations: [RetencionesproveedorComponent]
})
export class RetencionesproveedorModule { }
