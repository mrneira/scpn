import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { GenerarRoutingModule } from './generar.routing';
import { GenerarComponent } from './componentes/generar.component';

@NgModule({
  imports: [SharedModule, GenerarRoutingModule],
  declarations: [GenerarComponent]
})
export class GenerarModule { }
