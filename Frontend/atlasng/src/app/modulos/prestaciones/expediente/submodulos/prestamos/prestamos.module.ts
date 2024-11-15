import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { PrestamosRoutingModule } from './prestamos.routing';
import { PrestamosComponent } from './componentes/prestamos.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

import { TooltipModule} from 'primeng/primeng';
@NgModule({
  imports: [SharedModule, PrestamosRoutingModule, JasperModule,TooltipModule],
  declarations: [PrestamosComponent],
  exports: [PrestamosComponent]
}) 
export class PrestamosModule { }  