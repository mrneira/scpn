import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OficioscompraRoutingModule } from './oficioscompra.routing';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';
import { OficioscompraComponent } from './componentes/oficioscompra.component';

@NgModule({
  imports: [SharedModule, OficioscompraRoutingModule, JasperModule, LovInversionesModule],
  declarations: [OficioscompraComponent],
  exports: [OficioscompraComponent]
})
export class OficioscompraModule { }
