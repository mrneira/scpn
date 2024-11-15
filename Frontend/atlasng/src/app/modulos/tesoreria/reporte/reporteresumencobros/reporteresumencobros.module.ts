import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ReporteResumenCobrosRoutingModule } from './reporteresumencobros.routing';
import { ReporteResumenCobrosComponent } from './componentes/reporteresumencobros.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ReporteResumenCobrosRoutingModule, JasperModule,TooltipModule],
  declarations: [ReporteResumenCobrosComponent]
})
export class ReporteResumenCobrosModule { }
