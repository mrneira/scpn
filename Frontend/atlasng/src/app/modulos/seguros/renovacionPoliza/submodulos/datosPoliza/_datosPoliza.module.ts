import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { DatosPolizaRoutingModule } from './_datosPoliza.routing';
import { DatosPolizaComponent } from './componentes/_datosPoliza.component';

@NgModule({
  imports: [SharedModule, DatosPolizaRoutingModule],
  declarations: [DatosPolizaComponent],
  exports: [DatosPolizaComponent]
})
export class DatosPolizaModule { }
