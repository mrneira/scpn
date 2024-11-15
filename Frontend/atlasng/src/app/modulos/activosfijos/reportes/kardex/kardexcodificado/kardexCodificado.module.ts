import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { KardexCodificadoRoutingModule } from './kardexCodificado.routing';
import { KardexCodificadoComponent } from './componentes/kardexCodificado.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../../lov/productos/lov.productos.module';

@NgModule({
  imports: [SharedModule, KardexCodificadoRoutingModule, JasperModule, LovProductosModule ],
  declarations: [KardexCodificadoComponent]
})
export class KardexCodificadoModule { }
