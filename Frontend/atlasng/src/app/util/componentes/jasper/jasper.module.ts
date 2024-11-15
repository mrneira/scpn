import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { JasperRoutingModule } from './jasper.routing';

import { JasperComponent } from './componentes/jasper.component';

import { TooltipModule} from 'primeng/primeng';
@NgModule({
  imports: [SharedModule, JasperRoutingModule,TooltipModule],
  declarations: [JasperComponent],
  exports: [JasperComponent,TooltipModule],
})
export class JasperModule { }

