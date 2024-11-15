import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { GeneraDevolucionRoutingModule } from './generaDevolucion.routing';
import { GeneraDevolucionComponent } from './componentes/generaDevolucion.component';

@NgModule({
  imports: [SharedModule, GeneraDevolucionRoutingModule],
  declarations: [GeneraDevolucionComponent]
})
export class GeneraDevolucionModule { }
