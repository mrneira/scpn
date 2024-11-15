import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { VencimientosProveedoresRoutingModule } from './vencimientosproveedores.routing';

import { VencimientosProveedoresComponent } from './componentes/vencimientosproveedores.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProveedoresModule } from '../../lov/proveedores/lov.proveedores.module';



@NgModule({
  imports: [SharedModule, VencimientosProveedoresRoutingModule, JasperModule, LovProveedoresModule ],
  declarations: [VencimientosProveedoresComponent]
})
export class VencimientosProveedoresModule { }
