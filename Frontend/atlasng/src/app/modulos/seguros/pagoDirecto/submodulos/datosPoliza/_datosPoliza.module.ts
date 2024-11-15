import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { DatosPolizaRoutingModule } from './_datosPoliza.routing';
import { DatosPolizaComponent } from './componentes/_datosPoliza.component';
import { GestorDocumentalModule } from '../../../../gestordocumental/gestordocumental.module';

@NgModule({
  imports: [SharedModule, DatosPolizaRoutingModule, GestorDocumentalModule],
  declarations: [DatosPolizaComponent],
  exports: [DatosPolizaComponent]
})
export class DatosPolizaModule { }
