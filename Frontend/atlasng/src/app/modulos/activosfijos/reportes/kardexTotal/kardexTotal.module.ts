import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { KardexTotalRoutingModule } from './kardexTotal.routing';
import { KardexTotalComponent } from './componentes/kardexTotal.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';

@NgModule({
  imports: [SharedModule, KardexTotalRoutingModule, JasperModule, LovProductosModule ],
  declarations: [KardexTotalComponent]
})
export class KardexTotalModule { }
