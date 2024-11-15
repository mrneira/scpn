import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ReporteCobrosRoutingModule } from './reportecobros.routing';
import { ReporteCobrosComponent } from './componentes/reportecobros.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ReporteCobrosRoutingModule, JasperModule,TooltipModule],
  declarations: [ReporteCobrosComponent]
})
export class ReporteCobrosModule { }
