import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MantenimientoVectorPreciosRoutingModule } from './mantenimientovectorprecios.routing';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';
import { MantenimientoVectorPreciosComponent } from './componentes/mantenimientovectorprecios.component';

@NgModule({
  imports: [SharedModule, MantenimientoVectorPreciosRoutingModule, LovInversionesModule],
  declarations: [MantenimientoVectorPreciosComponent]
})
export class MantenimientoVectorPreciosModule { }
