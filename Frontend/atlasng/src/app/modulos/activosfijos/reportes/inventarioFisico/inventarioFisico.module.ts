import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { InventarioFisicoRoutingModule } from './inventarioFisico.routing';
import { InventarioFisicoComponent } from './componentes/inventarioFisico.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';

@NgModule({
  imports: [SharedModule, InventarioFisicoRoutingModule, JasperModule, LovProductosModule ],
  declarations: [InventarioFisicoComponent]
})
export class InventarioFisicoModule { }
