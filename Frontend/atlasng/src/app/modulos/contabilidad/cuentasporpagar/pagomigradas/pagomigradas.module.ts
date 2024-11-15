import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagoMigradasRoutingModule } from './pagomigradas.routing';
import { LovProveedoresModule } from '../../lov/proveedores/lov.proveedores.module';
import { PagoMigradasComponent } from './componentes/pagomigradas.component';


@NgModule({
  imports: [SharedModule, PagoMigradasRoutingModule, LovProveedoresModule ],
  declarations: [ PagoMigradasComponent]
})
export class PagoMigradasModule { }
