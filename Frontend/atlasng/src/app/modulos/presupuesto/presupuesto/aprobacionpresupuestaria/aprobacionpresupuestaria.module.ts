import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AprobacionPresupuestariaRoutingModule } from './aprobacionpresupuestaria.routing';
import { AprobacionPresupuestariaComponent } from './componentes/aprobacionpresupuestaria.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, AprobacionPresupuestariaRoutingModule, JasperModule,TooltipModule],
  declarations: [AprobacionPresupuestariaComponent]
})
export class AprobacionPresupuestariaModule { }
