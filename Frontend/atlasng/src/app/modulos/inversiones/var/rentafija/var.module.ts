import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { VarReporteRoutingModule } from './var.routing';

import { VarReporteComponent } from './componentes/var.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {CheckboxModule} from 'primeng/primeng';
import {TabViewModule} from 'primeng/primeng';
import {MultiSelectModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, VarReporteRoutingModule, JasperModule,MultiSelectModule,CheckboxModule,TabViewModule ],
  declarations: [VarReporteComponent]
})
export class VarReporteModule { }
