import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { AuxiliarPresupuestarioIngresosComponent } from './componentes/auxiliarPresupuestarioIngresos.component';
import { AuxiliarPresupuestarioIngresosRoutingModule } from './auxiliarPresupuestarioIngresos.routing';
import { LovPartidaIngresoModule } from '../../lov/partidaingreso/lov.partidaingreso.module';

@NgModule({
  imports: [SharedModule, AuxiliarPresupuestarioIngresosRoutingModule, JasperModule, LovPartidaIngresoModule ],
  declarations: [AuxiliarPresupuestarioIngresosComponent]
})
export class AuxiliarPresupuestarioIngresosModule { }
