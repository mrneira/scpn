import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CronologiaValoresReporteRoutingModule } from './cronologiaValoresReporte.routing';
import { CronologiaValoresReporteComponent } from './componentes/cronologiaValoresReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';

@NgModule({
  imports: [SharedModule, CronologiaValoresReporteRoutingModule, JasperModule, LovProductosModule ],
  declarations: [CronologiaValoresReporteComponent]
})
export class CronologiaValoresReporteModule { }
