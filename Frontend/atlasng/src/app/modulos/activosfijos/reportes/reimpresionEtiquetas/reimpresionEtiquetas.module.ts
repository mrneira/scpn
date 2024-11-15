import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ReimpresionEtiquetasRoutingModule } from './reimpresionEtiquetas.routing';
import { ReimpresionEtiquetasComponent } from './componentes/reimpresionEtiquetas.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';
import { LovCodificadosModule } from '../../lov/codificados/lov.codificados.module';

@NgModule({
  imports: [SharedModule, ReimpresionEtiquetasRoutingModule, JasperModule, LovProductosModule,LovCodificadosModule ],
  declarations: [ReimpresionEtiquetasComponent]
})
export class ReimpresionEtiquetasModule { }
