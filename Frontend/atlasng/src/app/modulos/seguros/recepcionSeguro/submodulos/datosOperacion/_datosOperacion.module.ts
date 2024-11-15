import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { DatosOperacionRoutingModule } from './_datosOperacion.routing';
import { DatosOperacionComponent } from './componentes/_datosOperacion.component';

@NgModule({
  imports: [SharedModule, DatosOperacionRoutingModule],
  declarations: [DatosOperacionComponent],
  exports: [DatosOperacionComponent]
})
export class DatosOperacionModule { }
