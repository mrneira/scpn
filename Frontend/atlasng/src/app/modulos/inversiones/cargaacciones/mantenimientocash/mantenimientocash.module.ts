import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MantenimientoCashRoutingModule } from './mantenimientocash.routing';
//import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';
import { MantenimientoCashComponent } from './componentes/mantenimientocash.component';

@NgModule({
  imports: [SharedModule, MantenimientoCashRoutingModule],
  declarations: [MantenimientoCashComponent]
})
export class MantenimientoCashModule { }
