import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { ValVencidosRoutingRouting } from './_valVencidos.routing';
import { ValVencidosComponent } from './componentes/_valVencidos.component';

@NgModule({
  imports: [SharedModule, ValVencidosRoutingRouting ],
  declarations: [ValVencidosComponent],
  exports: [ValVencidosComponent]
})
export class ValVencidosModule { }
